import { authRoutes } from "@/modules/auth/server/procedures";
import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  auth: authRoutes,
});

export type AppRouter = typeof appRouter;
