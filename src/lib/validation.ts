import { z } from "zod";
import { SEVERITIES } from "./constants";

const trimmed = (msg: string, max = 200) => z.string({ error: msg }).trim().min(1, msg).max(max);

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Enter your email address.")
  .max(254)
  .pipe(z.email("Enter a valid email address."));

export const passwordRule = z
  .string()
  .min(8, "Password does not meet the requirements.")
  .max(128, "Password does not meet the requirements.")
  .regex(/[A-Za-z]/, "Password does not meet the requirements.")
  .regex(/\d/, "Password does not meet the requirements.");

export const PASSWORD_HINT = "At least 8 characters, with a letter and a number.";

export const signUpSchema = z
  .object({
    name: trimmed("Please enter your full name.", 100),
    email: emailSchema,
    password: passwordRule,
    confirmPassword: z.string().min(1, "Passwords do not match."),
    terms: z.literal("on", { error: "Please accept the Terms of Service to continue." }),
  })
  .refine((v) => v.password === v.confirmPassword, { path: ["confirmPassword"], message: "Passwords do not match." });

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().min(1, "Enter your email address."),
  password: z.string().min(1, "Enter your password."),
  remember: z.string().optional(),
});

export const forgotSchema = z.object({ email: emailSchema });

export const resetSchema = z
  .object({
    token: z.string().min(10),
    password: passwordRule,
    confirmPassword: z.string().min(1, "Passwords do not match."),
  })
  .refine((v) => v.password === v.confirmPassword, { path: ["confirmPassword"], message: "Passwords do not match." });

export const contactSchema = z.object({
  name: trimmed("Please enter your full name.", 100),
  email: emailSchema,
  subject: trimmed("Please tell us what your message is about.", 150),
  message: trimmed("Please enter a message.", 4000),
});

export const onboardingSchema = z.object({
  experienceLevel: z.enum(["NEW", "BASICS", "TESTER"]).optional(),
  learningGoal: z.enum(["FIND_BUGS", "WRITE_REPORTS", "JOB_PREP", "TECHNIQUES"]).optional(),
});

export function bugReportSchema(requireSeverity: boolean) {
  return z.object({
    title: trimmed("Please enter a bug title.", 150),
    description: z.string().trim().max(2000).optional().default(""),
    steps: trimmed("Add the steps needed to reproduce the issue.", 3000),
    expected: trimmed("Describe the expected behavior.", 1500),
    actual: trimmed("Describe the actual behavior.", 1500),
    severity: requireSeverity
      ? z.enum(SEVERITIES, { error: "Select a severity." })
      : z.enum(SEVERITIES).optional().or(z.literal("").transform(() => undefined)),
    environment: z.string().trim().max(200).optional().default(""),
  });
}

export const paymentRequestSchema = z.object({
  reference: trimmed("Enter the payment reference from your receipt.", 120),
  note: z.string().trim().max(500).optional().default(""),
});

/** Flatten zod issues to { field: firstMessage }. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
