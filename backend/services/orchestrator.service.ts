import SessionModel, { ISession, ITask } from '../models/Session';

// Very small heuristic-based orchestrator for demo purposes
const KNOWN_SKILLS = [
  'react', 'javascript', 'typescript', 'node', 'express', 'mongodb', 'css', 'html', 'redux', 'graphql', 'docker', 'kubernetes', 'aws', 'sql', 'python', 'java'
];

function extractSkills(text?: string): string[] {
  if (!text) return [];
  const lowered = text.toLowerCase();
  const found: string[] = [];
  for (const skill of KNOWN_SKILLS) {
    if (lowered.includes(skill)) found.push(skill);
  }
  return found;
}

async function recordSessionActivity(sessionId: string, args: { stage: string; message: string; details?: string; progress?: number; status?: ISession['status'] }) {
  const update: Record<string, any> = {
    $push: {
      activityLog: {
        stage: args.stage,
        message: args.message,
        details: args.details,
        createdAt: new Date(),
      },
    },
    $set: {
      currentStep: args.stage,
    },
  };

  if (typeof args.progress === 'number') {
    update.$set.progress = Math.max(0, Math.min(100, Math.round(args.progress)));
  }

  if (args.status) {
    update.$set.status = args.status;
  }

  await SessionModel.updateOne({ _id: sessionId }, update).exec();
}

async function generateTasks(sessionId: string, skills: string[], session: ISession): Promise<ITask[]> {
  const tasks: ITask[] = [];
  const deadline = session.deadline ? new Date(session.deadline) : null;
  const now = new Date();
  const totalDays = deadline ? Math.max(1, Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))) : 14;

  await recordSessionActivity(sessionId, {
    stage: 'timeline-calculation',
    message: 'Computing pacing strategy based on deadline and current date.',
    details: deadline ? `${totalDays} day window to target deadline.` : 'No deadline provided, using default 14 day horizon.',
    progress: 52,
  });

  // Priority by order
  skills.forEach((skill, idx) => {
    const due = new Date(now.getTime() + ((idx + 1) * totalDays * 24 * 60 * 60 * 1000) / Math.max(1, skills.length));
    tasks.push({
      title: `Master ${skill}`,
      description: `Study core concepts and implement sample projects in ${skill}.`,
      resources: [
        `https://www.example.com/search?q=${encodeURIComponent(skill + ' tutorial')}`,
        `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + ' tutorial')}`
      ],
      dueDate: due,
      priority: skills.length - idx
    });
  });

  // Add a wrap-up task
  tasks.push({
    title: 'Mock Interview & Review',
    description: 'Perform a mock interview and review weak areas.',
    resources: ['https://www.pramp.com', 'https://interviewing.io'],
    dueDate: deadline || new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
    priority: 1
  });

  if (skills.length === 0) {
    await recordSessionActivity(sessionId, {
      stage: 'plan-finalization',
      message: 'No direct skill matches were found, so the agent is building a general-purpose interview plan from your goal prompt.',
      progress: 88,
    });
  }

  await recordSessionActivity(sessionId, {
    stage: 'task-blueprint-ready',
    message: `Prepared ${tasks.length} scheduled task block${tasks.length === 1 ? '' : 's'} for execution.`,
    details: tasks.slice(0, 4).map((task) => task.title).join(' | '),
    progress: 90,
  });

  return tasks;
}

export async function orchestrateSession(sessionId: string) {
  const session = await SessionModel.findById(sessionId).exec();
  if (!session) throw new Error('Session not found');

  try {
    await recordSessionActivity(sessionId, {
      stage: 'analysis-started',
      message: 'Agent orchestration started. Reading the resume context and targeting the requested outcome.',
      details: `Competency: ${session.competency || 'not provided'} | Agents: ${session.agents?.length ? session.agents.join(', ') : 'default set'}`,
      progress: 12,
      status: 'running',
    });

    // extract skills
    const skills = extractSkills(session.resumeText || session.extraContext);

    await recordSessionActivity(sessionId, {
      stage: 'resume-signals',
      message: skills.length > 0
        ? `Detected ${skills.length} core skill signal${skills.length === 1 ? '' : 's'} from the uploaded context.`
        : 'No explicit technical keywords were detected, so the agent is leaning on the role and goal prompt.',
      details: skills.length > 0 ? skills.join(', ') : session.role || 'goal prompt only',
      progress: 35,
    });

    // fallback: use role keywords
    if (skills.length === 0 && session.role) {
      skills.push(...session.role.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean));
      await recordSessionActivity(sessionId, {
        stage: 'role-expansion',
        message: 'Expanded the plan using keywords from the target role.',
        details: session.role,
        progress: 45,
      });
    }

    // generate tasks
    await recordSessionActivity(sessionId, {
      stage: 'plan-building',
      message: 'Converting the extracted signals into a prioritized task roadmap.',
      details: `Signal count: ${skills.length} | Goal context length: ${(session.extraContext || '').length}`,
      progress: 58,
    });

    const tasks = await generateTasks(sessionId, skills, session);

    await SessionModel.updateOne({ _id: sessionId }, {
      $set: {
        tasks,
        status: 'completed',
        progress: 100,
        currentStep: 'completed',
      },
      $push: {
        activityLog: {
          stage: 'completed',
          message: 'Roadmap generated successfully. The session is ready for review.',
          createdAt: new Date(),
        },
      },
    }).exec();

    return await SessionModel.findById(sessionId).exec();
  } catch (err) {
    await SessionModel.updateOne({ _id: sessionId }, {
      $set: {
        status: 'failed',
        currentStep: 'failed',
      },
      $push: {
        activityLog: {
          stage: 'failed',
          message: err instanceof Error ? err.message : 'The agent encountered an unexpected error while generating the plan.',
          createdAt: new Date(),
        },
      },
    }).exec();
    throw err;
  }
}

export default { orchestrateSession };
