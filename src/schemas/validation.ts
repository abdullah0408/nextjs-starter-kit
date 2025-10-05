import { ValidationResult } from "@/types";
import { z } from "zod";

export function validateWithZod<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map((issue) => {
        const path = issue.path.length > 0 ? `${issue.path.join(".")}: ` : "";
        return `${path}${issue.message}`;
      });
      return { success: false, errors };
    }
    return { success: false, errors: ["Validation failed"] };
  }
}

export function formatValidationErrors(errors: string[]): string {
  if (errors.length === 1) {
    return errors[0];
  }
  return (
    "Multiple validation errors:\n" +
    errors.map((error) => ` ${error}`).join("\n")
  );
}
