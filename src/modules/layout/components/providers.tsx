import { ThemeProvider } from "@/modules/layout/components/theme-provider";
import { TRPCReactProvider } from "@/trpc/client";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <TRPCReactProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </TRPCReactProvider>
  );
}
