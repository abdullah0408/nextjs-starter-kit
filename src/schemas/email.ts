import { z } from "zod";

const emailStringSchema = z.email("Invalid email address format");

const emailRecipientsSchema = z.union([
  emailStringSchema,
  z.array(emailStringSchema).min(1, "At least one recipient is required"),
]);

const fromEmailSchema = z.string().refine(
  (val) => {
    const simpleEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (simpleEmailRegex.test(val)) {
      return true;
    }

    const displayNameEmailRegex = /^(.+)\s+<([^\s@]+@[^\s@]+\.[^\s@]+)>$/;
    if (displayNameEmailRegex.test(val)) {
      return true;
    }

    return false;
  },
  {
    message:
      "From email must be either 'user@domain.com' or 'Display Name <user@domain.com>' format",
  }
);

const emailSubjectSchema = z
  .string()
  .min(1, "Email subject is required")
  .max(998, "Email subject exceeds maximum length (998 characters)")
  .refine((val) => val.trim().length > 0, {
    message: "Email subject cannot be only whitespace",
  });

const reactElementSchema = z.any().refine(
  (val) => {
    return (
      val != null &&
      (typeof val === "object" || typeof val === "function") &&
      (val.$$typeof || val.type || val.props !== undefined)
    );
  },
  { message: "Must be a valid React element or component" }
);

const htmlContentSchema = z.object({
  html: z
    .string()
    .min(1, "HTML content cannot be empty")
    .refine((val) => val.trim().length > 0, {
      message: "HTML content cannot be only whitespace",
    }),
  text: z.string().optional(),
  react: reactElementSchema.optional(),
});

const textContentSchema = z.object({
  text: z
    .string()
    .min(1, "Text content cannot be empty")
    .refine((val) => val.trim().length > 0, {
      message: "Text content cannot be only whitespace",
    }),
  html: z.string().optional(),
  react: reactElementSchema.optional(),
});

const reactContentSchema = z.object({
  react: reactElementSchema,
  html: z.string().optional(),
  text: z.string().optional(),
});

const baseEmailOptionsSchema = z.object({
  to: emailRecipientsSchema,
  subject: emailSubjectSchema,
  from: fromEmailSchema,
});

export const sendEmailOptionsSchema = baseEmailOptionsSchema.and(
  z.union([htmlContentSchema, textContentSchema, reactContentSchema])
);

const sendEmailResponseSuccessSchema = z.object({
  success: z.literal(true),
  data: z.object({
    id: z.string(),
    from: z.string(),
    to: z.array(z.string()),
    createdAt: z.string(),
  }),
});

const sendEmailResponseErrorSchema = z.object({
  success: z.literal(false),
  error: z.union([
    z.string(),
    z.object({
      message: z.string(),
      name: z.string().optional(),
    }),
  ]),
});

export const sendEmailResponseSchema = z.union([
  sendEmailResponseSuccessSchema,
  sendEmailResponseErrorSchema,
]);
