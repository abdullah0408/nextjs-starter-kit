import { z } from "zod";
import { signUpSchema } from "../schemas";

export interface SignUpFormProps {
  onSuccess?: () => void;
  callbackURL?: string;
}

export type SignUpFormData = z.infer<typeof signUpSchema>;
