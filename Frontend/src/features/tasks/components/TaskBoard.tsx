import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Circle, Clock, AlertCircle, Calendar as CalIcon } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Task = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  priority: number;
  estimated_minutes: number | null;
  scheduled_for: string | null;
  due_date: string | null;
  status: "pending" | "in_progress" | "done";
  progress: number;
};

const priorityLabel = (p: number) =>
  p === 1 ? "Critical" : p === 2 ? "High" : p === 3 ? "Medium" : p === 4 ? "Low" : "Optional";

const priorityClass = (p: number) =>
  p <= 1
    ? "bg-destructive/15 text-destructive border-destructive/30"
    : p === 2
    ? "bg-warning/15 text-warning border-warning/30"
    : p === 3
    ? "bg-primary/15 text-primary border-primary/30"
    : "bg-muted text-muted-foreground border-border";

export function TaskBoard() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const completeFn = async (args: any) => fetch('/api/complete-task', { method: 'POST', body: JSON.stringify(args) }).then(r => r.json());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tab, setTab] = useState<"all" | "today" | "done">("all");

  useEffect(() => {
    if (!user) return;
    let mounted = true;

    const load = async () => {
      const { data } = await supabase
        .from("tasks")
        .select("id,title,description,category,priority,estimated_minutes,scheduled_for,due_date,status,progress")
        .order("priority")
        .order("scheduled_for");
      if (mounted && data) setTasks(data as Task[]);
    };
    load();

    const channel = supabase
      .channel("tasks-" + user.id)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks", filter: `user_id=eq.${user.id}` },
        () => load(),
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [user]);

  const setProgress = async (t: Task, p: number) => {
    setTasks((prev) => prev.map((x) => (x.id === t.id ? { ...x, progress: p, status: p >= 100 ? "done" : p > 0 ? "in_progress" : "pending" } : x)));
    try {
      await completeFn({ data: { taskId: t.id, progress: p } });
      qc.invalidateQueries();
    } catch (e) {
      console.error(e);
    }
  };

  const todayStr = new Date().toDateString();
  const visible = tasks.filter((t) => {
    if (tab === "done") return t.status === "done";
    if (tab === "today") return t.scheduled_for && new Date(t.scheduled_for).toDateString() === todayStr;
    return t.status !== "done";
  });

  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "done").length;
  const overall = total === 0 ? 0 : Math.round(tasks.reduce((s, t) => s + t.progress, 0) / total);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Stat label="Total tasks" value={String(total)} />
        <Stat label="Completed" value={`${done} / ${total}`} />
        <Stat label="Overall progress" value={`${overall}%`} bar={overall} />
      </div>

      <div className="flex items-center gap-2">
        <TabBtn active={tab === "all"} onClick={() => setTab("all")}>Active</TabBtn>
        <TabBtn active={tab === "today"} onClick={() => setTab("today")}>Today</TabBtn>
        <TabBtn active={tab === "done"} onClick={() => setTab("done")}>Done</TabBtn>
      </div>

      <div className="grid gap-3">
        {visible.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-surface/40 p-10 text-center text-muted-foreground">
            Nothing here yet.
          </div>
        )}
        {visible.map((t) => (
          <TaskCard key={t.id} t={t} onProgress={(p) => setProgress(t, p)} />
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value, bar }: { label: string; value: string; bar?: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-3xl font-semibold">{value}</div>
      {typeof bar === "number" && <Progress value={bar} className="mt-3" />}
    </div>
  );
}

function TabBtn({ active, children, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { active: boolean }) {
  return (
    <button
      {...rest}
      className={`rounded-full border px-4 py-1.5 text-sm transition ${
        active
          ? "border-primary/40 bg-primary/10 text-primary"
          : "border-border bg-surface text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function TaskCard({ t, onProgress }: { t: Task; onProgress: (p: number) => void }) {
  const due = t.scheduled_for ? new Date(t.scheduled_for) : null;
  const overdue = due && due < new Date() && t.status !== "done";

  return (
    <div className="group rounded-2xl border border-border bg-card p-5 shadow-card transition hover:border-primary/30">
      <div className="flex items-start gap-4">
        <button
          onClick={() => onProgress(t.status === "done" ? 0 : 100)}
          className="mt-0.5 shrink-0"
          aria-label="Toggle done"
        >
          {t.status === "done" ? (
            <CheckCircle2 className="h-5 w-5 text-success" />
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground hover:text-primary" />
          )}
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className={`font-semibold ${t.status === "done" ? "text-muted-foreground line-through" : ""}`}>
              {t.title}
            </h3>
            <Badge className={`border ${priorityClass(t.priority)}`}>{priorityLabel(t.priority)}</Badge>
            {t.category && <Badge variant="outline" className="border-border text-xs">{t.category}</Badge>}
            {overdue && (
              <Badge className="border border-destructive/40 bg-destructive/15 text-destructive">
                <AlertCircle className="mr-1 h-3 w-3" /> Overdue
              </Badge>
            )}
          </div>
          {t.description && (
            <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            {due && (
              <span className="inline-flex items-center gap-1">
                <CalIcon className="h-3.5 w-3.5" />
                {format(due, "EEE, MMM d • h:mm a")} ({formatDistanceToNow(due, { addSuffix: true })})
              </span>
            )}
            {t.estimated_minutes && (
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> {t.estimated_minutes} min
              </span>
            )}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Progress value={t.progress} className="h-1.5 flex-1" />
            <span className="w-10 text-right text-xs font-mono text-muted-foreground">{t.progress}%</span>
          </div>
          <div className="mt-3 flex gap-2">
            {[0, 25, 50, 75, 100].map((p) => (
              <Button
                key={p}
                variant={t.progress === p ? "default" : "outline"}
                size="sm"
                className={`h-7 px-2 text-xs ${t.progress === p ? "bg-primary text-primary-foreground" : ""}`}
                onClick={() => onProgress(p)}
              >
                {p}%
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
