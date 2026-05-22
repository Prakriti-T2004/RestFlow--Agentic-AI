import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "../middlewares/auth.middleware";
import { generatePlan, generatePlanSchema } from "../controllers/plan.controller";
import { saveResume, saveResumeSchema } from "../controllers/resume.controller";
import { completeTask, completeTaskSchema, prepareTask, prepareTaskSchema } from "../controllers/task.controller";

export const generatePlanFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => generatePlanSchema.parse(d))
  .handler(async ({ data, context }) => {
    return await generatePlan(data, context.userId);
  });

export const saveResumeFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => saveResumeSchema.parse(d))
  .handler(async ({ data, context }) => {
    return await saveResume(data, context.userId);
  });

export const completeTaskFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => completeTaskSchema.parse(d))
  .handler(async ({ data }) => {
    return await completeTask(data);
  });

export const prepareTaskFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => prepareTaskSchema.parse(d))
  .handler(async ({ data }) => {
    return await prepareTask(data);
  });
