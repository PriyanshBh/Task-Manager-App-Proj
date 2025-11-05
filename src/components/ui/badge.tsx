import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: "blue" | "green" | "amber";
}

const colorClasses: Record<NonNullable<BadgeProps["color"]>, string> = {
  blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20",
  green: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/20"
};

export function Badge({ className, color = "blue", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase",
        colorClasses[color],
        className
      )}
      {...props}
    />
  );
}
