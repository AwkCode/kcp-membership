import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

interface SendMembershipSMSParams {
  to: string;
  firstName: string;
  token: string;
}

export async function sendMembershipSMS({
  to,
  firstName,
  token,
}: SendMembershipSMSParams) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const cardUrl = `${baseUrl}/m/${token}`;

  await client.messages.create({
    body: `Welcome to Kings Court, ${firstName}! Your membership is active. View your digital card & QR code here: ${cardUrl}`,
    from: process.env.TWILIO_PHONE_NUMBER!,
    to,
  });
}
