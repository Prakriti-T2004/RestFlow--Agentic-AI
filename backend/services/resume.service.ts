import { supabaseAdmin } from "../integrations/supabase/client.server";

export async function saveUserResume(payload: {
  rawText: string;
  fileName: string | null;
  filePath: string | null;
  userId: string;
}) {
  const { data: row, error } = await supabaseAdmin
    .from("resumes")
    .insert({
      user_id: payload.userId,
      raw_text: payload.rawText,
      file_name: payload.fileName ?? null,
      file_path: payload.filePath ?? null,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return { id: row.id };
}
