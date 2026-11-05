import { contactConfig } from '../config/contact.ts';
import { normalizeContact, validateContact } from '../domain/contact.ts';
import type { ContactInput } from '../domain/contact.ts';
export type EmailDelivery = (input: ContactInput, captchaToken?: string) => Promise<unknown>;
async function deliverEmail(input: ContactInput, captchaToken?: string): Promise<unknown> {
  const { default: emailjs } = await import('@emailjs/browser');
  // EmailJS public identifiers are intended for browser use; never put a private key here.
  return emailjs.send(
    contactConfig.serviceId,
    contactConfig.templateId,
    { from_name: input.name, email: input.email, subject: input.subject, message: input.message, ...(captchaToken ? { 'g-recaptcha-response': captchaToken } : {}) },
    { publicKey: contactConfig.publicKey, limitRate: { id: 'portfolio-contact', throttle: 30_000 } },
  );
}
export async function sendContact(input: ContactInput, delivery: EmailDelivery = deliverEmail, captchaToken?: string): Promise<void> {
  if (Object.keys(validateContact(input)).length) throw new Error('Invalid contact input');
  await delivery(normalizeContact(input), captchaToken);
  // Delivery errors deliberately propagate. The UI must retain the draft and show failure.
}
