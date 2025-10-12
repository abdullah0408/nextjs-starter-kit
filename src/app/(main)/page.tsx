"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export default function Home() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.auth.getMe.queryOptions());
  return (
    <div>
      <ThemeToggle />
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
