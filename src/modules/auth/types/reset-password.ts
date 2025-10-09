import { z } from "zod";
import { resetPasswordSchema } from "@/modules/auth/schemas";

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
