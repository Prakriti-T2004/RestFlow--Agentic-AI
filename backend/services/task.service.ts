import { supabaseAdmin } from "../integrations/supabase/client.server";

export async function updateUserTask(payload: { taskId: string; progress: number }) {
  const status: "done" | "in_progress" | "pending" =
    payload.progress >= 100 ? "done" : payload.progress > 0 ? "in_progress" : "pending";
  const update = {
    progress: payload.progress,
    status,
    completed_at: payload.progress >= 100 ? new Date().toISOString() : null,
  };
  const { error } = await supabaseAdmin.from("tasks").update(update).eq("id", payload.taskId);
  if (error) throw new Error(error.message);
  return { ok: true };
}
