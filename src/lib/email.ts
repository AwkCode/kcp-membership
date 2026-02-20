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

interface SendBookingEmailParams {
  to: string;
  artistName: string;
  showName: string;
  showDate: string;
  startTime: string;
  status: "approved" | "rejected" | "waitlisted";
}

export async function sendBookingStatusEmail({
  to,
  artistName,
  showName,
  showDate,
  startTime,
  status,
}: SendBookingEmailParams) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const statusConfig = {
    approved: {
      subject: `You're on the lineup — ${showName}`,
      heading: "You're In!",
      message: `Your spot has been approved for <strong>${showName}</strong> on <strong>${showDate}</strong> at <strong>${startTime}</strong>. Check your bookings for details.`,
      color: "#22c55e",
      cta: { text: "View My Spots", url: `${baseUrl}/artists/bookings` },
    },
    rejected: {
      subject: `Booking update — ${showName}`,
      heading: "Not This Time",
      message: `Your request for <strong>${showName}</strong> on <strong>${showDate}</strong> was not approved. Check back for upcoming shows.`,
      color: "#ef4444",
      cta: { text: "Browse Shows", url: `${baseUrl}/shows` },
    },
    waitlisted: {
      subject: `You're on the waitlist — ${showName}`,
      heading: "Waitlisted",
      message: `The lineup for <strong>${showName}</strong> on <strong>${showDate}</strong> is currently full. You're on the waitlist — we'll let you know if a spot opens up.`,
      color: "#eab308",
      cta: { text: "View My Spots", url: `${baseUrl}/artists/bookings` },
    },
  };

  const config = statusConfig[status];

  const msg = {
    to,
    from: process.env.SENDGRID_FROM_EMAIL!,
    subject: config.subject,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #1a1a2e; text-align: center;">Kings Court</h1>
        <h2 style="color: ${config.color}; text-align: center;">${config.heading}</h2>
        <p style="color: #555; text-align: center; font-size: 16px;">
          Hey ${artistName},
        </p>
        <p style="color: #555; text-align: center; font-size: 15px; line-height: 1.6;">
          ${config.message}
        </p>
        <p style="text-align: center; margin-top: 24px;">
          <a href="${config.cta.url}" style="display: inline-block; padding: 12px 24px; background: #1a1a2e; color: #fff; text-decoration: none; border-radius: 6px;">
            ${config.cta.text}
          </a>
        </p>
        <p style="color: #999; font-size: 12px; text-align: center; margin-top: 32px;">
          Kings Court Boston — kingscourtboston.com
        </p>
      </div>
    `,
  };

  await sgMail.send(msg);
}
