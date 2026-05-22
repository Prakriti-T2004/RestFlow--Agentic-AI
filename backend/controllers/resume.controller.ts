import { saveUserResume } from "../services/resume.service";
import { z } from "zod";

export const saveResumeSchema = z.object({
  rawText: z.string().min(20).max(20000),
  fileName: z.string().max(200).optional().nullable(),
  filePath: z.string().max(500).optional().nullable(),
});

export async function saveResume(data: z.infer<typeof saveResumeSchema>, userId: string) {
  return await saveUserResume({
    ...data,
    fileName: data.fileName ?? null,
    filePath: data.filePath ?? null,
    userId,
  });
}
