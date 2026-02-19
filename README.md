# Kings Court — Instant Check-In Membership

A lightweight membership system with QR-based check-in for Kings Court.

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS
- **Supabase** Postgres + Auth (staff login)
- **SendGrid** transactional email
- **qrcode** server-side QR generation

## Setup

### 1. Clone and install

```bash
cd kcp-membership
npm install
```

### 2. Create Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. In the SQL Editor, run the migration file:

```bash
# Copy and paste the contents of:
supabase/migrations/001_create_tables.sql
```

3. Create a staff user in Supabase Dashboard → Authentication → Users → Add User (email + password).

### 3. Configure environment

```bash
cp .env.local.example .env.local
```

Fill in your values:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) |
| `SENDGRID_API_KEY` | SendGrid API key |
| `SENDGRID_FROM_EMAIL` | Verified sender email in SendGrid |
| `NEXT_PUBLIC_BASE_URL` | Your app URL (e.g., `http://localhost:3000`) |

### 4. Run

```bash
npm run dev
```

## Routes

### Public

| Route | Description |
|---|---|
| `/join` | Membership signup form |
| `/m/[token]` | Digital member card with QR code |

### Staff-only (requires login)

| Route | Description |
|---|---|
| `/scan` | Camera QR scanner → check in members |
| `/door` | Search members by name/email/phone → check in |
| `/admin` | List all members, edit status/notes, rotate tokens |
| `/login` | Staff authentication |

### API

| Endpoint | Auth | Description |
|---|---|---|
| `POST /api/join` | Public | Create member, send welcome email |
| `GET /api/scan/m/[token]` | Staff | Look up member by token |
| `POST /api/checkin` | Staff | Log a check-in |
| `GET /api/members` | Staff | List all members |
| `GET /api/members/search?q=` | Staff | Search members (ILIKE) |
| `PATCH /api/members/[id]` | Staff | Update member status/notes |
| `POST /api/members/[id]/rotate-token` | Staff | Generate new membership token |

## How it works

1. **Visitor** fills out the form at `/join`
2. System creates their member record, generates a secure token, and emails them a QR code + link to their digital card
3. **At the door**, staff opens `/scan` on their phone, scans the member's QR code
4. System looks up the member, shows their info and status
5. Staff taps **Check In** to log the visit
6. If camera scanning isn't available, staff uses `/door` to search by name/email/phone

## QR Scanner Browser Support

The `/scan` page uses the [BarcodeDetector API](https://developer.mozilla.org/en-US/docs/Web/API/BarcodeDetector). This is supported natively in:

- Chrome on Android
- Chrome on macOS (v83+)
- Safari on iOS 15.4+

For unsupported browsers, use the `/door` manual search page instead.

## Deployment

Deploy to Vercel:

```bash
npx vercel
```

Set all environment variables in the Vercel dashboard. Make sure `NEXT_PUBLIC_BASE_URL` points to your production domain.
