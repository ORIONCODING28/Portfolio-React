export interface ContactInput { name: string; email: string; subject: string; message: string }
export type ContactField = keyof ContactInput;
export type ValidationIssue = 'name' | 'email' | 'subject' | 'message' | 'length';
export type ContactErrors = Partial<Record<ContactField, ValidationIssue>>;
export const contactLimits: Record<ContactField, number> = { name: 120, email: 254, subject: 200, message: 5000 };
export function normalizeContact(input: ContactInput): ContactInput {
  return { name: input.name.trim(), email: input.email.trim(), subject: input.subject.trim(), message: input.message.trim() };
}
export function validateContact(input: ContactInput): ContactErrors {
  const value = normalizeContact(input);
  const errors: ContactErrors = {};
  if (value.name.length < 2) errors.name = 'name';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)) errors.email = 'email';
  if (value.subject.length < 3) errors.subject = 'subject';
  if (value.message.length < 10) errors.message = 'message';
  for (const field of Object.keys(contactLimits) as ContactField[]) if (value[field].length > contactLimits[field]) errors[field] = 'length';
  return errors;
}
