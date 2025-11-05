"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc/client";
import type { RouterOutputs } from "@/lib/trpc/types";
import { signOutAction } from "@/features/auth/actions";

const statusOptions = [
  { value: "todo",        label: "To do" },
  { value: "in_progress", label: "In progress" },
  { value: "done",        label: "Done" },
] as const;

type Task = RouterOutputs["task"]["list"][number];

type TaskDashboardProps = {
  user: {
    id: string;
    email: string;
    name?: string | null;
  };
};

export function TaskDashboard({ user }: TaskDashboardProps) {
  const utils = trpc.useContext();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | Task["status"]>("all");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { data: tasks, isLoading } = trpc.task.list.useQuery({
    query: query.trim() || undefined,
    status: status === "all" ? undefined : status,
  });

  const createTask = trpc.task.create.useMutation({
    onSuccess: async () => {
      await utils.task.list.invalidate();
    },
  });

  const updateTask = trpc.task.update.useMutation({
    onSuccess: async () => {
      await utils.task.list.invalidate();
      setEditingTask(null);
    },
  });

  const deleteTask = trpc.task.delete.useMutation({
    onSuccess: async () => {
      await utils.task.list.invalidate();
    },
  });

  const handleSubmit = async (formData: FormData) => {
    const payload = {
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      status: String(formData.get("status") ?? "todo") as Task["status"],
      id: editingTask?.id,
    };

    if (!payload.title || !payload.description) return;

    if (editingTask) {
      await updateTask.mutateAsync(
        payload as { id: string; title: string; description: string; status: Task["status"] }
      );
    } else {
      const { id, ...data } = payload;
      await createTask.mutateAsync(data);
    }
  };

  const taskFormId = editingTask ? "edit-task" : "new-task";

  return (
    <div className="space-y-8">
      {/* Header / sign out */}
      <section className="flex flex-col gap-4 rounded-lg border border-border bg-background p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            Welcome back{user.name ? `, ${user.name}` : ""}!
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage your tasks and track your progress.
          </p>
        </div>
        <form action={signOutAction}>
          <Button type="submit" variant="outline">
            Sign out
          </Button>
        </form>
      </section>

      {/* Search / Filter + Create/Edit form */}
      <section className="rounded-lg border border-border bg-background p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-1 gap-3">
            <Input
              placeholder="Search by title or description"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <select
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={status}
              onChange={(event) => setStatus(event.target.value as typeof status)}
            >
              <option value="all">All statuses</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {editingTask && (
            <Button variant="ghost" type="button" onClick={() => setEditingTask(null)}>
              Cancel editing
            </Button>
          )}
        </div>

        <form
          key={editingTask?.id ?? "new"}
          onSubmit={async (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            await handleSubmit(formData);
            if (!editingTask) {
              event.currentTarget.reset();
            }
          }}
          className="space-y-4"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor={`${taskFormId}-title`}>
                Title
              </label>
              <Input
                id={`${taskFormId}-title`}
                name="title"
                defaultValue={editingTask?.title ?? ""}        
                placeholder="Design review"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor={`${taskFormId}-status`}>
                Status
              </label>
              <select
                id={`${taskFormId}-status`}
                name="status"
                defaultValue={editingTask?.status ?? "todo"}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor={`${taskFormId}-description`}>
              Description
            </label>
            <Textarea
              id={`${taskFormId}-description`}
              name="description"
              defaultValue={editingTask?.description ?? ""}    
              placeholder="Outline the deliverables and stakeholders"
            />
          </div>

          <div className="flex items-center justify-end gap-3">
            <Button
              type="submit"
              disabled={createTask.isLoading || updateTask.isLoading}  
            >
              {editingTask ? "Save changes" : "Create task"}
            </Button>
          </div>
        </form>
      </section>

      {/* Tasks list */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Your tasks</h3>
        <div className="grid gap-4">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading tasks…</p>
          ) : tasks && tasks.length > 0 ? (
            tasks.map((task) => (
              <article key={task.id} className="rounded-lg border border-border bg-background p-4 shadow-sm">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h4 className="text-lg font-semibold">{task.title}</h4>
                      <Badge color={badgeColor(task.status)}>{humanizeStatus(task.status)}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                    <p className="text-xs text-muted-foreground">
                      Updated {new Date(task.updatedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" onClick={() => setEditingTask(task)}>
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-red-500 hover:bg-red-500/10"
                      onClick={() => deleteTask.mutate({ id: task.id })}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No tasks found. Create your first task to get started.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

function humanizeStatus(status: Task["status"]) {
  switch (status) {
    case "todo":
      return "To do";
    case "in_progress":
      return "In progress";
    case "done":
      return "Done";
    default:
      return status;
  }
}

function badgeColor(status: Task["status"]) {
  switch (status) {
    case "todo":
      return "amber" as const;
    case "in_progress":
      return "blue" as const;
    case "done":
      return "green" as const;
    default:
      return "blue" as const;
  }
}
