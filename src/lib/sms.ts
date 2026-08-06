import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

interface SendMembershipSMSParams {
  to: string;
  firstName: string;
  token: string;
  tier?: string;
}

/**
 * Normalize a US phone number to E.164 format (+1XXXXXXXXXX).
 * Handles: (617) 555-1234, 617-555-1234, 6175551234, +16175551234, etc.
 */
function normalizePhone(phone: string): string {
  // Strip everything except digits and leading +
  const digits = phone.replace(/[^\d]/g, "");

  // If already has country code (11 digits starting with 1)
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+${digits}`;
  }

  // Standard 10-digit US number
  if (digits.length === 10) {
    return `+1${digits}`;
  }

  // Already in E.164 or international — return as-is with +
  if (phone.startsWith("+")) {
    return phone.replace(/[^\d+]/g, "");
  }

  // Fallback — return with + prefix
  return `+${digits}`;
}

export async function sendMembershipSMS({
  to,
  firstName,
  token,
  tier = "free",
}: SendMembershipSMSParams) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const cardUrl = `${baseUrl}/m/${token}`;
  const normalizedTo = normalizePhone(to);

  const body = `Welcome to Kings Court, ${firstName}! Your membership is active. View your digital card & QR code here: ${cardUrl}`;

  await client.messages.create({
    body,
    from: process.env.TWILIO_PHONE_NUMBER!,
    to: normalizedTo,
  });
}
