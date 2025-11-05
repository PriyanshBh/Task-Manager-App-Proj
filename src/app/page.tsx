export const dynamic = "force-dynamic";

import { ThemeToggle } from "@/components/theme-toggle";
import { TaskDashboard } from "@/features/tasks/task-dashboard";
import { AuthScreen } from "@/features/auth/auth-screen";

export default async function HomePage() {
  // lazy import inside function so it's not analyzed during build
  const { getServerSession } = await import("@/server/auth");
  const session = await getServerSession();

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-10">
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Task Manager</h1>
            <p className="text-muted-foreground">
              Organize your work, track progress, and stay productive.
            </p>
          </div>
          <ThemeToggle />
        </header>
        {session?.user ? (
          <TaskDashboard user={session.user} />
        ) : (
          <AuthScreen />
        )}
      </div>
    </main>
  );
}
