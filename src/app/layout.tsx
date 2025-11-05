import type { Metadata } from "next";
import React from "react";
import "@/styles/globals.css";
import { Providers } from "@/app/providers";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Task Manager",
  description: "Task management app with authentication, filters, and dark mode"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("font-sans antialiased")}> 
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
