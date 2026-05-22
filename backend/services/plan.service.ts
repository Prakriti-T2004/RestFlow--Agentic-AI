import { supabaseAdmin } from "../integrations/supabase/client.server";

// Calls a generative AI model to get a structured plan back.
export async function generatePlanForUser(payload: {
  resumeText: string;
  targetRole: string;
  company?: string | null;
  interviewDate: string;
  focusAreas?: string[];
  userId: string;
}) {
  const plan = await callPlannerLLM(payload);

  // Insert the goal
  const { data: goal, error: goalErr } = await supabaseAdmin
    .from("interview_goals")
    .insert({
      user_id: payload.userId,
      target_role: payload.targetRole,
      company: payload.company ?? null,
      interview_date: payload.interviewDate,
      focus_areas: payload.focusAreas ?? null,
      notes: plan.summary,
      // resume_id: payload.resumeId ?? null,
    })
    .select()
    .single();
  if (goalErr) throw new Error(goalErr.message);

  // Insert tasks
  const rows = plan.tasks.map((t) => ({
    user_id: payload.userId,
    goal_id: goal.id,
    title: t.title,
    description: t.description,
    category: t.category,
    priority: t.priority,
    estimated_minutes: t.estimated_minutes,
    scheduled_for: t.scheduled_for,
    due_date: t.scheduled_for,
  }));
  const { error: taskErr } = await supabaseAdmin.from("tasks").insert(rows);
  if (taskErr) throw new Error(taskErr.message);

  // Notify
  await supabaseAdmin.from("notifications").insert({
    user_id: payload.userId,
    title: "Your prep plan is ready",
    body: `${plan.tasks.length} tasks scheduled for ${payload.targetRole}`,
    type: "plan_ready",
  });

  return { goalId: goal.id, taskCount: plan.tasks.length, summary: plan.summary };
}

async function callPlannerLLM(payload: {
  resumeText: string;
  targetRole: string;
  company?: string | null;
  interviewDate: string;
  focusAreas?: string[];
}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

  const daysUntil = Math.max(
    1,
    Math.ceil((new Date(payload.interviewDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
  );

  const system = `You are Synapse, an elite interview prep coach. Build a prioritized, time-boxed study plan tailored to the candidate's resume and target role.
  
  Rules:
  - Priority is an integer 1 (highest impact, do first) to 5 (lowest).
  - Schedule tasks evenly between today and the interview date (${daysUntil} days). Use ISO 8601 timestamps.
  - Front-load the highest-priority items (priority 1-2) in the first half of the window.
  - Each task must be concrete, actionable, and standalone (not "study X" — instead "Build a debounced search input in React in 45 min").
  - Generate 8-14 tasks total. Cover: strengths to sharpen, gaps to close, behavioral prep, and a mock interview the day before.
  - For category, use short tags like "frontend", "system-design", "behavioral", "dsa", "hr", "communication", "mock".
  - estimated_minutes between 20 and 120.`;

  const user = `RESUME:
  ${payload.resumeText.slice(0, 6000)}
  
  TARGET ROLE: ${payload.targetRole}
  COMPANY: ${payload.company || "N/A"}
  INTERVIEW DATE: ${payload.interviewDate}
  FOCUS AREAS: ${(payload.focusAreas || []).join(", ") || "auto-detect from resume gaps"}
  TODAY: ${new Date().toISOString()}
  
  Build the plan now.`;

  const requestSummary = {
    resumeChars: payload.resumeText.length,
    resumePreview: payload.resumeText.replace(/\s+/g, " ").trim().slice(0, 240),
    targetRole: payload.targetRole,
    company: payload.company || "N/A",
    interviewDate: payload.interviewDate,
    focusAreas: payload.focusAreas || [],
    daysUntil,
  };

  console.log("[PlanService] Gemini request", requestSummary);

  const body = {
    model: "google/gemini-3-flash-preview",
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    tools: [
      {
        type: "function",
        function: {
          name: "submit_plan",
          description: "Submit the prioritized interview prep plan.",
          parameters: {
            type: "object",
            properties: {
              summary: {
                type: "string",
                description: "Two-sentence overview tailored to candidate.",
              },
              tasks: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                    category: { type: "string" },
                    priority: { type: "integer", minimum: 1, maximum: 5 },
                    estimated_minutes: { type: "integer", minimum: 15, maximum: 180 },
                    scheduled_for: { type: "string", description: "ISO 8601 timestamp" },
                  },
                  required: [
                    "title",
                    "description",
                    "category",
                    "priority",
                    "estimated_minutes",
                    "scheduled_for",
                  ],
                  additionalProperties: false,
                },
              },
            },
            required: ["summary", "tasks"],
            additionalProperties: false,
          },
        },
      },
    ],
    tool_choice: { type: "function", function: { name: "submit_plan" } },
  };

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  if (res.status === 429) throw new Error("Rate limit hit. Please wait a minute and try again.");
  if (res.status === 402)
    throw new Error("AI credits exhausted. Add funds in Settings → Workspace → Usage.");
  if (!res.ok) {
    const errorText = await res.text();
    console.log("[PlanService] Gemini error response", { status: res.status, body: errorText.slice(0, 1000) });
    throw new Error(`AI gateway error ${res.status}: ${errorText}`);
  }

  const json = await res.json();
  const call = json.choices?.[0]?.message?.tool_calls?.[0];
  if (!call) throw new Error("AI did not return a plan");
  const args =
    typeof call.function.arguments === "string"
      ? JSON.parse(call.function.arguments)
      : call.function.arguments;

  console.log("[PlanService] Gemini response", {
    summaryPreview: typeof args.summary === "string" ? args.summary.slice(0, 240) : "",
    taskCount: Array.isArray(args.tasks) ? args.tasks.length : 0,
    taskTitles: Array.isArray(args.tasks) ? args.tasks.slice(0, 5).map((task: any) => task.title) : [],
  });

  return args as {
    summary: string;
    tasks: Array<{
      title: string;
      description: string;
      category: string;
      priority: number;
      estimated_minutes: number;
      scheduled_for: string;
    }>;
  };
}
