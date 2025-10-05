import { resend } from "@/lib/resend";
import {
  formatValidationErrors,
  sendEmailOptionsSchema,
  validateWithZod,
} from "@/schemas";
import type { SendEmailOptions, SendEmailResponse } from "@/types";
import { CreateEmailResponse } from "resend";

/**
 * Sends an email via Resend service.
 *
 * Validates input parameters and handles errors gracefully.
 * Content priority: React > HTML > Text (if multiple types provided, React is used first, then HTML, then Text).
 *
 * @param options - Email configuration object with recipient(s), subject, sender, and content
 * @param options.to - Recipient email address (string) or multiple addresses (string[])
 * @param options.subject - Email subject line
 * @param options.from - Sender email address. Supports: "sender@domain.com" or "Display Name <sender@domain.com>"
 * @param options.html - HTML email content (**at least one content type required**)
 * @param options.text - Plain text email content (**at least one content type required**)
 * @param options.react - React component for email content (**at least one content type required**)
 * @returns Promise<SendEmailResponse> - Object with success boolean, data on success, or error message on failure
 *          Success: { success: true, data: { id, from, to, createdAt } }
 *          Failure: { success: false, error: "Error message" }
 *
 * @example
 * ```typescript
 * // Basic email
 * const result = await sendEmail({
 *   to: "user@example.com",
 *   subject: "Welcome to our platform!",
 *   from: "noreply@myapp.com",
 *   html: "<h1>Welcome!</h1><p>Thanks for joining us.</p>"
 * });
 *
 * // Multiple recipients with display names
 * const newsletter = await sendEmail({
 *   to: ["john@example.com", "jane@example.com"],
 *   subject: "Monthly Newsletter",
 *   from: "Newsletter Team <newsletter@myapp.com>", // Display name with email
 *   text: "Check out this month's updates!"
 * });
 * ```
 */
export async function sendEmail(
  options: SendEmailOptions
): Promise<SendEmailResponse> {
  const validation = validateWithZod(sendEmailOptionsSchema, options);

  if (!validation.success) {
    return {
      success: false,
      error: formatValidationErrors(validation.errors),
    };
  }

  const { to, subject, from, html, text, react } = validation.data;

  const emailContent = react ? { react } : html ? { html } : { text: text! };

  try {
    const result: CreateEmailResponse = await resend.emails.send({
      from,
      to,
      subject,
      ...emailContent,
    });

    if (result.error) {
      return {
        success: false,
        error: result.error.message || "Failed to send email",
      };
    }

    if (!result.data) {
      return {
        success: false,
        error: "No data returned from email service",
      };
    }

    return {
      success: true,
      data: {
        id: result.data.id,
        from: from,
        to: Array.isArray(to) ? to : [to],
        createdAt: new Date().toISOString(),
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
