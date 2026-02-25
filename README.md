# Kings Court Boston — Venue Operations Platform

A full-stack venue operations platform built for [Kings Court Boston](https://kingscourtboston.com), a live comedy club, coffee shop, and 420-friendly creative venue in Boston, MA. Handles membership, artist booking, and show lineup management in one system.

**Live:** [member.kingscourtboston.com](https://member.kingscourtboston.com)

## What It Does

### Membership System
- Account-based signup with email + password (creates Supabase Auth account)
- Member login with authenticated account page
- Digital member cards with QR code, visit counter, and light/dark mode toggle
- Apple Wallet and Google Wallet pass integration
- Instant QR code delivery via email and SMS
- Staff QR scanner (camera-based, works on iPhone/Safari via jsQR)
- Door check-in with manual search by name, email, or phone
- Admin panel: member management, status control (active, VIP, staff, comp, suspended), CSV export
- Visit tracking and check-in history
- Upcoming events display on member account page

### Artist Portal
- Artist signup and login (shares auth with staff/members — same email can be multiple roles)
- Profile management: display name, bio, Instagram, video links, tags
- Browse upcoming shows with real-time spot availability
- Self-serve spot requests with optional notes to the booker
- "My Spots" dashboard to track request statuses and cancel

### Show Booking & Lineup Management
- Staff create shows with date, time, venue, capacity, and optional Eventbrite link
- Booking request queue: approve, reject, or waitlist incoming requests
- Email notifications to artists on booking status changes (approved, rejected, waitlisted)
- Auto-waitlist when show hits capacity, auto-add to lineup on approval
- Lineup builder with reordering, role assignment (performer, host, feature, headliner), and set length controls
- Show lifecycle management: scheduled, closed, canceled
- Artist directory with search, filter, approve/ban

### Design & Branding
- Dark purple gradient theme with ambient glow effects
- Hand-drawn SVG doodle art (mic, coffee, joint, leaf, star, crown, speaker) scattered across all pages
- Circle-cropped graffiti brand art (OSN, KCTV, Smile High Club) as subtle side decorations
- Page fade-in animations
- Fully responsive mobile-first design

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 |
| Database | Supabase Postgres + Row Level Security |
| Auth | Supabase Auth (multi-role) |
| Email | SendGrid (domain-verified) |
| SMS | Twilio |
| QR | `qrcode` (generation) + `jsQR` (scanning) |
| Apple Wallet | `passkit-generator` |
| Google Wallet | `jsonwebtoken` (JWT signing for skinny pass approach) |
| Hosting | Vercel |

## How It Works

### Members
1. Visitor signs up at `/join` with email + password (creates an auth account)
2. System creates their record, generates a secure token, emails a QR code + card link
3. Member can log in at `/members/login` to view their card, account settings, visit count, and upcoming events
4. Member can add their card to Apple Wallet or Google Wallet
5. At the door, staff opens `/scan` on their phone and scans the QR
6. System verifies member status and staff taps **Check In**
7. Fallback: staff uses `/door` to search by name/email/phone

### Artists
1. Artist signs up at `/artists/join` (existing members can use the same email)
2. Browses upcoming shows at `/shows`, picks one, hits **Request Spot**
3. Staff sees the request in `/admin/shows/[id]` and approves, rejects, or waitlists
4. Artist receives an email notification with the decision (approved, rejected, or waitlisted)
5. On approval, the artist is auto-added to the lineup
6. Staff reorders the lineup, assigns roles, sets time lengths

## Routes

### Public

| Route | Description |
|---|---|
| `/` | Auth-aware homepage (personalized when logged in) |
| `/join` | Membership signup |
| `/perks` | Member benefits (comedy, coffee, 420-friendly lounge) |
| `/m/[token]` | Digital member card with QR code + wallet buttons |
| `/terms` | Terms of Service & Privacy Policy |
| `/shows` | Upcoming shows (artist view) |
| `/shows/[id]` | Show detail + request spot |

### Member (requires login)

| Route | Description |
|---|---|
| `/members/login` | Member login |
| `/members/account` | Member dashboard — card, settings, visits, events |

### Staff (requires login)

| Route | Description |
|---|---|
| `/scan` | Camera QR scanner |
| `/door` | Search + manual check-in |
| `/admin` | Member management + CSV export |
| `/admin/shows` | Create and manage shows |
| `/admin/shows/[id]` | Requests queue + lineup builder |
| `/admin/artists` | Artist directory + approve/ban |

### Artist (requires login)

| Route | Description |
|---|---|
| `/artists/profile` | Edit profile |
| `/artists/bookings` | Track spot requests |

### API

| Endpoint | Description |
|---|---|
| `POST /api/join` | Create member + auth account + send email/SMS |
| `GET /api/scan/m/[token]` | Look up member by token |
| `POST /api/checkin` | Log a check-in |
| `GET /api/members` | List all members |
| `GET /api/members/search?q=` | Search members |
| `GET/PATCH /api/members/account` | Authenticated member account data |
| `PATCH /api/members/[id]` | Update member (staff) |
| `POST /api/members/[id]/rotate-token` | New membership token |
| `GET /api/members/export` | CSV export |
| `GET /api/wallet/apple/[token]` | Generate Apple Wallet .pkpass |
| `GET /api/wallet/google/[token]` | Redirect to Google Wallet save URL |
| `POST /api/artists/signup` | Create artist account |
| `GET/PATCH /api/artists/me` | Artist profile |
| `GET/POST/PATCH /api/shows` | Show CRUD |
| `GET/POST /api/requests` | Booking requests |
| `PATCH /api/requests/[id]` | Approve/reject/waitlist |
| `GET/PATCH/DELETE /api/lineup` | Lineup management |

## Database

7 tables with Row Level Security:

- **members** — profiles, tokens, statuses, contact info, linked to auth accounts via `auth_id`
- **checkins** — check-in log with staff attribution
- **comedians** — artist profiles linked to auth accounts (table name kept for compatibility)
- **shows** — schedule, capacity, status, Eventbrite links
- **booking_requests** — spot requests with approval workflow
- **show_lineup** — confirmed lineup with ordering and roles
- **comedian_checkins** — show-day comedian check-ins

## Setup

### Prerequisites
- Node.js 18+
- Supabase project
- SendGrid account (verified sender/domain)
- Twilio account
- Apple Developer account (for Apple Wallet passes)
- Google Cloud project + Google Wallet issuer account (for Google Wallet passes)

### Install

```bash
git clone https://github.com/AwkCode/kcp-membership.git
cd kcp-membership
npm install
```

### Configure

Create `.env.local`:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# SendGrid
SENDGRID_API_KEY=your_sendgrid_key
SENDGRID_FROM_EMAIL=your_verified_email

# Twilio
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number

# Apple Wallet (base64 encoded certificates)
APPLE_WWDR_CERT=base64_encoded_wwdr_cert
APPLE_PASS_CERT=base64_encoded_pass_cert
APPLE_PASS_KEY=base64_encoded_pass_key
APPLE_PASS_KEY_PASSPHRASE=your_passphrase
APPLE_PASS_TYPE_ID=pass.com.kingscourtboston.membership
APPLE_TEAM_ID=your_team_id

# Google Wallet
GOOGLE_WALLET_ISSUER_ID=your_issuer_id
GOOGLE_WALLET_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}
```

### Database

Run migrations in order in Supabase SQL Editor:

1. `supabase/migrations/001_create_tables.sql`
2. `supabase/migrations/002_checkin_notes.sql`
3. `supabase/migrations/003_comedian_portal.sql`
4. `supabase/migrations/004_show_eventbrite_url.sql`
5. `supabase/migrations/006_members_auth_id.sql`

Create a staff user in Supabase Auth dashboard with `role: "staff"` in user metadata.

### Run

```bash
npm run dev
```

### Deploy

```bash
npx vercel
```

Set all environment variables in the Vercel dashboard.

## License

MIT
