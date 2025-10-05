import { z } from "zod";
import { sendEmailOptionsSchema, sendEmailResponseSchema } from "@/schemas";

export type SendEmailOptions = z.infer<typeof sendEmailOptionsSchema>;
export type SendEmailResponse = z.infer<typeof sendEmailResponseSchema>;
