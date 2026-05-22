import { updateUserTask } from "../services/task.service";
import { z } from "zod";
import { generateTaskPreparation } from "../services/task-preparation.service";

export const completeTaskSchema = z.object({
  taskId: z.string().uuid(),
  progress: z.number().min(0).max(100),
});

export async function completeTask(data: z.infer<typeof completeTaskSchema>) {
  return await updateUserTask(data);
}

export const prepareTaskSchema = z.object({
  sessionId: z.string().min(1),
  taskIndex: z.number().int().min(0),
});

export async function prepareTask(data: z.infer<typeof prepareTaskSchema>) {
  return await generateTaskPreparation(data.sessionId, data.taskIndex);
}
