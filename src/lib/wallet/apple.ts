import { PKPass } from "passkit-generator";
import path from "path";
import fs from "fs";

interface MemberPassData {
  firstName: string;
  lastName: string;
  status: string;
  token: string;
  memberSince: string;
}

// Load pass template images from the passTemplate directory
function loadTemplateImages(): Record<string, Buffer> {
  const templateDir = path.join(process.cwd(), "src/lib/wallet/passTemplate");
  const files = fs.readdirSync(templateDir);
  const buffers: Record<string, Buffer> = {};

  for (const file of files) {
    if (file.endsWith(".png")) {
      buffers[file] = fs.readFileSync(path.join(templateDir, file));
    }
  }

  return buffers;
}

// Decode base64 env var to Buffer
function envToBuffer(envVar: string): Buffer {
  const value = process.env[envVar];
  if (!value) {
    throw new Error(`Missing environment variable: ${envVar}`);
  }
  return Buffer.from(value, "base64");
}

// Status display mapping
const statusDisplay: Record<string, string> = {
  active: "Active",
  vip: "VIP",
  staff: "Staff",
  comp: "Comp",
};

export async function generateApplePass(member: MemberPassData): Promise<Buffer> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://member.kingscourtboston.com";
  const scanUrl = `${baseUrl}/scan/m/${member.token}`;

  const templateImages = loadTemplateImages();

  const pass = new PKPass(
    templateImages,
    {
      wwdr: envToBuffer("APPLE_WWDR_CERT"),
      signerCert: envToBuffer("APPLE_PASS_CERT"),
      signerKey: envToBuffer("APPLE_PASS_KEY"),
      signerKeyPassphrase: process.env.APPLE_PASS_KEY_PASSPHRASE || "",
    },
    {
      formatVersion: 1,
      passTypeIdentifier: process.env.APPLE_PASS_TYPE_ID || "pass.com.kingscourtboston.membership",
      teamIdentifier: process.env.APPLE_TEAM_ID || "",
      serialNumber: member.token,
      organizationName: "Kings Court Boston",
      description: "Kings Court Boston Membership Card",
      foregroundColor: "rgb(255, 255, 255)",
      backgroundColor: "rgb(0, 0, 0)",
      labelColor: "rgb(255, 255, 255)",
      logoText: "Kings Court",
    }
  );

  // Set pass type to generic
  pass.type = "generic";

  // Add fields using the API methods
  pass.primaryFields.push({
    key: "member",
    label: "MEMBER",
    value: `${member.firstName} ${member.lastName}`,
  });

  pass.secondaryFields.push(
    {
      key: "status",
      label: "STATUS",
      value: statusDisplay[member.status] || member.status,
    },
    {
      key: "since",
      label: "MEMBER SINCE",
      value: new Date(member.memberSince).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
    }
  );

  pass.backFields.push(
    {
      key: "website",
      label: "Website",
      value: "kingscourtboston.com",
    },
    {
      key: "cardUrl",
      label: "Digital Card",
      value: `${baseUrl}/m/${member.token}`,
    },
    {
      key: "info",
      label: "About",
      value: "Kings Court Boston — Boston's underground comedy club. Show this pass at the door for check-in.",
    }
  );

  // Set the QR barcode — same URL staff already scan
  pass.setBarcodes({
    format: "PKBarcodeFormatQR",
    message: scanUrl,
    messageEncoding: "iso-8859-1",
    altText: `${member.firstName} ${member.lastName}`,
  });

  const buffer = pass.getAsBuffer();
  return buffer;
}
