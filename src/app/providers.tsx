"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { TRPCProvider } from "@/lib/trpc/provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <TRPCProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </TRPCProvider>
  );
}
