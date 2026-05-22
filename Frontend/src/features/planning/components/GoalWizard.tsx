import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Sparkles, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/features/auth/hooks/use-auth";

export function GoalWizard({ onCreated }: { onCreated: () => void }) {
  const { user } = useAuth();
  const qc = useQueryClient();

  // Replaced backend useServerFn with standard API calls
  const genFn = async (args: any) => fetch('/api/generate-plan', { method: 'POST', body: JSON.stringify(args) }).then(r => r.json());
  const saveFn = async (args: any) => fetch('/api/save-resume', { method: 'POST', body: JSON.stringify(args) }).then(r => r.json());

  const [resumeText, setResumeText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [targetRole, setTargetRole] = useState("");
  const [company, setCompany] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [focus, setFocus] = useState("");

  const upload = async (file: File) => {
    if (!user) return;
    const path = `${user.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("resumes").upload(path, file, { upsert: false });
    if (error) {
      toast.error(error.message);
      return;
    }
    setFilePath(path);
    setFileName(file.name);
    if (file.type === "text/plain") {
      const txt = await file.text();
      setResumeText(txt);
    } else {
      toast.message("File uploaded", { description: "Also paste the resume text below so the agent can read it." });
    }
  };

  const mutation = useMutation({
    mutationFn: async () => {
      if (!targetRole || !interviewDate || resumeText.length < 50) {
        throw new Error("Add your resume text, role, and interview date");
      }
      let resumeId: string | undefined;
      try {
        const r = await saveFn({ data: { rawText: resumeText, fileName, filePath } });
        resumeId = r.id;
      } catch (e) {
        console.warn("saveResume failed", e);
      }
      const focusAreas = focus.split(",").map((s) => s.trim()).filter(Boolean);
      return genFn({
        data: {
          resumeText,
          targetRole,
          company: company || null,
          interviewDate: new Date(interviewDate).toISOString(),
          focusAreas,
          resumeId,
        },
      });
    },
    onSuccess: (res) => {
      toast.success("Plan generated", { description: `${res.taskCount} tasks scheduled` });
      qc.invalidateQueries();
      onCreated();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const minDate = new Date().toISOString().slice(0, 16);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <div className="mb-1 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <h2 className="font-display text-xl font-semibold">Create your prep plan</h2>
      </div>
      <p className="text-sm text-muted-foreground">
        The agent reads your resume and target role, then schedules prioritized tasks.
      </p>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2 space-y-2">
          <Label>Resume</Label>
          <Textarea
            rows={8}
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume text here (skills, experience, projects)…"
            className="font-mono text-xs"
          />
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 hover:bg-surface-2">
              <Upload className="h-3.5 w-3.5" />
              {fileName ? fileName : "Upload .txt or PDF (optional)"}
              <input
                type="file"
                accept=".txt,.pdf"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
              />
            </label>
            <span>{resumeText.length} chars</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Target role *</Label>
          <Input value={targetRole} onChange={(e) => setTargetRole(e.target.value)} placeholder="Frontend Engineer" />
        </div>
        <div className="space-y-2">
          <Label>Company (optional)</Label>
          <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Stripe" />
        </div>
        <div className="space-y-2">
          <Label>Interview date *</Label>
          <Input
            type="datetime-local"
            value={interviewDate}
            min={minDate}
            onChange={(e) => setInterviewDate(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Focus areas (comma-separated)</Label>
          <Input
            value={focus}
            onChange={(e) => setFocus(e.target.value)}
            placeholder="React, system design, behavioral"
          />
        </div>
      </div>

      <Button
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending}
        size="lg"
        className="mt-6 w-full bg-primary-gradient text-primary-foreground shadow-glow hover:opacity-90"
      >
        {mutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Agent is planning…
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" /> Generate prioritized plan
          </>
        )}
      </Button>
    </div>
  );
}
