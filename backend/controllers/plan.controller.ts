import { generatePlanForUser } from "../services/plan.service";
import { z } from "zod";

export const generatePlanSchema = z.object({
  resumeText: z.string().min(50, "Resume text is too short").max(20000),
  targetRole: z.string().min(2).max(120),
  company: z.string().max(120).optional().nullable(),
  interviewDate: z.string().min(10),
  focusAreas: z.array(z.string().max(60)).max(10).optional(),
  resumeId: z.string().uuid().optional().nullable(),
});

export async function generatePlan(data: z.infer<typeof generatePlanSchema>, userId: string) {
  return await generatePlanForUser({
    resumeText: data.resumeText,
    targetRole: data.targetRole,
    company: data.company,
    interviewDate: data.interviewDate,
    focusAreas: data.focusAreas,
    userId,
  });
}
