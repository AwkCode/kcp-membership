import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

interface SendMembershipEmailParams {
  to: string;
  firstName: string;
  lastName: string;
  token: string;
  qrImageBase64: string;
}

export async function sendMembershipEmail({
  to,
  firstName,
  lastName,
  token,
  qrImageBase64,
}: SendMembershipEmailParams) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const cardUrl = `${baseUrl}/m/${token}`;

  // Strip the data:image/png;base64, prefix for attachment
  const base64Data = qrImageBase64.replace(/^data:image\/png;base64,/, "");

  const msg = {
    to,
    from: process.env.SENDGRID_FROM_EMAIL!,
    subject: "Welcome to Kings Court — Your Membership Card",
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #1a1a2e; text-align: center;">Kings Court</h1>
        <h2 style="color: #333; text-align: center;">Welcome, ${firstName} ${lastName}!</h2>
        <p style="color: #555; text-align: center;">
          Your membership is now active. Show the QR code below when you check in.
        </p>
        <div style="text-align: center; margin: 24px 0;">
          <img src="cid:qrcode" alt="Membership QR Code" width="250" height="250" />
        </div>
        <p style="text-align: center;">
          <a href="${cardUrl}" style="display: inline-block; padding: 12px 24px; background: #1a1a2e; color: #fff; text-decoration: none; border-radius: 6px;">
            View Your Digital Card
          </a>
        </p>
        <p style="color: #999; font-size: 12px; text-align: center; margin-top: 32px;">
          Keep this email — it contains your membership QR code.
        </p>
      </div>
    `,
    attachments: [
      {
        content: base64Data,
        filename: "qrcode.png",
        type: "image/png",
        disposition: "inline" as const,
        content_id: "qrcode",
      },
    ],
  };

  await sgMail.send(msg);
}
