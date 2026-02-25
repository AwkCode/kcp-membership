import jwt from "jsonwebtoken";

interface MemberPassData {
  firstName: string;
  lastName: string;
  status: string;
  token: string;
  memberSince: string;
}

// Status display mapping
const statusDisplay: Record<string, string> = {
  active: "Active Member",
  vip: "VIP Member",
  staff: "Staff",
  comp: "Comp",
};

/**
 * Generate a Google Wallet "Add to Wallet" URL for a member pass.
 *
 * Uses the "skinny JWT" approach — the pass class + object are defined
 * inline in the JWT payload, so no pre-creation via REST API is needed.
 * Google Wallet creates the object on-the-fly when the user taps "Save".
 */
export function generateGoogleWalletUrl(member: MemberPassData): string {
  const credentials = getCredentials();
  const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID;

  if (!issuerId) {
    throw new Error("Missing GOOGLE_WALLET_ISSUER_ID environment variable");
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://member.kingscourtboston.com";
  const scanUrl = `${baseUrl}/scan/m/${member.token}`;
  const cardUrl = `${baseUrl}/m/${member.token}`;

  // Unique object ID — one per member token so the pass can be updated
  const objectId = `${issuerId}.member-${member.token}`;
  const classId = `${issuerId}.kings-court-membership`;

  const memberSinceFormatted = new Date(member.memberSince).toLocaleDateString(
    "en-US",
    { month: "short", year: "numeric" }
  );

  // Build the generic pass object
  const genericObject = {
    id: objectId,
    classId: classId,
    genericType: "GENERIC_TYPE_UNSPECIFIED",
    hexBackgroundColor: "#0c0015",
    logo: {
      sourceUri: {
        uri: `${baseUrl}/kc-logo-v3.png`,
      },
      contentDescription: {
        defaultValue: {
          language: "en-US",
          value: "Kings Court Boston logo",
        },
      },
    },
    cardTitle: {
      defaultValue: {
        language: "en-US",
        value: "Kings Court Boston",
      },
    },
    subheader: {
      defaultValue: {
        language: "en-US",
        value: statusDisplay[member.status] || member.status,
      },
    },
    header: {
      defaultValue: {
        language: "en-US",
        value: `${member.firstName} ${member.lastName}`,
      },
    },
    barcode: {
      type: "QR_CODE",
      value: scanUrl,
      alternateText: `${member.firstName} ${member.lastName}`,
    },
    textModulesData: [
      {
        header: "STATUS",
        body: statusDisplay[member.status] || member.status,
        id: "status",
      },
      {
        header: "MEMBER SINCE",
        body: memberSinceFormatted,
        id: "since",
      },
    ],
    linksModuleData: {
      uris: [
        {
          uri: cardUrl,
          description: "View Digital Card",
          id: "card-link",
        },
        {
          uri: "https://kingscourtboston.com",
          description: "kingscourtboston.com",
          id: "website",
        },
      ],
    },
  };

  // Build the class inline (skinny JWT approach)
  const genericClass = {
    id: classId,
    classTemplateInfo: {
      cardTemplateOverride: {
        cardRowTemplateInfos: [
          {
            twoItems: {
              startItem: {
                firstValue: {
                  fields: [
                    {
                      fieldPath: "object.textModulesData['status']",
                    },
                  ],
                },
              },
              endItem: {
                firstValue: {
                  fields: [
                    {
                      fieldPath: "object.textModulesData['since']",
                    },
                  ],
                },
              },
            },
          },
        ],
      },
    },
  };

  // Build JWT claims
  const claims = {
    iss: credentials.client_email,
    aud: "google",
    origins: [baseUrl],
    typ: "savetowallet",
    payload: {
      genericClasses: [genericClass],
      genericObjects: [genericObject],
    },
  };

  // Sign with the service account private key
  const token = jwt.sign(claims, credentials.private_key, {
    algorithm: "RS256",
  });

  return `https://pay.google.com/gp/v/save/${token}`;
}

// Parse Google Cloud service account credentials from environment
function getCredentials(): {
  client_email: string;
  private_key: string;
} {
  const credentialsJson = process.env.GOOGLE_WALLET_SERVICE_ACCOUNT_KEY;

  if (!credentialsJson) {
    throw new Error(
      "Missing GOOGLE_WALLET_SERVICE_ACCOUNT_KEY environment variable"
    );
  }

  try {
    const parsed = JSON.parse(credentialsJson);
    if (!parsed.client_email || !parsed.private_key) {
      throw new Error(
        "Service account key must contain client_email and private_key"
      );
    }
    return {
      client_email: parsed.client_email,
      private_key: parsed.private_key,
    };
  } catch (err) {
    if (err instanceof SyntaxError) {
      throw new Error(
        "GOOGLE_WALLET_SERVICE_ACCOUNT_KEY is not valid JSON"
      );
    }
    throw err;
  }
}
