import { Link, useNavigate } from "@tanstack/react-router";
import { Brain, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { NotificationsBell } from "@/features/notifications/components/NotificationsBell";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const nav = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    nav({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-hero">
      <header className="sticky top-0 z-40 glass">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link to="/app" className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-primary-gradient shadow-glow">
              <Brain className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold">Synapse</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            <Link to="/app">
              <Button variant="ghost" size="sm">
                <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
              </Button>
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <NotificationsBell />
            <div className="hidden text-sm text-muted-foreground md:block">
              {user?.email}
            </div>
            <Button variant="ghost" size="icon" onClick={logout} aria-label="Sign out">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
