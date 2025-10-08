import { z } from "zod";
import { signInSchema } from "../schemas";

export interface SignInFormProps {
  onSuccess?: () => void;
  callbackURL?: string;
}

export type SignInFormData = z.infer<typeof signInSchema>;
