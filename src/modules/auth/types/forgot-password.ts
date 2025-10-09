import { z } from "zod";
import { forgotPasswordSchema } from "@/modules/auth/schemas";

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
