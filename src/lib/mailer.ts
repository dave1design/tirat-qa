import "server-only";

/**
 * Single integration point for outbound email.
 * No provider is configured yet, so messages are written to the server log.
 * Swap the body of this function for SMTP / a transactional provider before launch.
 */
export async function sendEmail(to: string, subject: string, text: string) {
  console.info(`\n[mail] to=${to}\n[mail] subject=${subject}\n${text}\n`);
}
