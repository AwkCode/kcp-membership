# Kings Court Boston — Venue Operations Platform

A full-stack venue operations platform built for [Kings Court Boston](https://kingscourtboston.com), a comedy club in Boston, MA. Handles membership, comedian booking, and show lineup management in one system.

**Live:** [member.kingscourtboston.com](https://member.kingscourtboston.com)

## What It Does

### Membership System
- Public signup with instant QR code delivery via email and SMS
- Digital member cards at unique URLs with self-cancel option
- Staff QR scanner (camera-based, works on iPhone/Safari via jsQR)
- Door check-in with manual search by name, email, or phone
- Admin panel: member management, status control (active, VIP, staff, comp, suspended), CSV export
- Visit tracking and check-in history

### Comedian Portal
- Comedian signup and login (shares auth with staff — same email can be both roles)
- Profile management: display name, bio, Instagram, video links, tags
- Browse upcoming shows with real-time spot availability
- Self-serve spot requests with optional notes to the booker
- "My Spots" dashboard to track request statuses and cancel

### Show Booking & Lineup Management
- Staff create shows with date, time, venue, capacity, and optional Eventbrite link
- Booking request queue: approve, reject, or waitlist incoming requests
- Email notifications to comedians on booking status changes (approved, rejected, waitlisted)
- Auto-waitlist when show hits capacity, auto-add to lineup on approval
- Lineup builder with reordering, role assignment (performer, host, feature, headliner), and set length controls
- Show lifecycle management: scheduled, closed, canceled
- Comedian directory with search, filter, approve/ban

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase Postgres + Row Level Security |
| Auth | Supabase Auth (multi-role) |
| Email | SendGrid (domain-verified) |
| SMS | Twilio |
| QR | `qrcode` (generation) + `jsQR` (scanning) |
| Hosting | Vercel |

## How It Works

### Members
1. Visitor signs up at `/join`
2. System creates their record, generates a secure token, emails a QR code + card link
3. At the door, staff opens `/scan` on their phone and scans the QR
4. System verifies member status and staff taps **Check In**
5. Fallback: staff uses `/door` to search by name/email/phone

### Comedians
1. Comic signs up at `/comedians/join` (existing members can use the same email)
2. Browses upcoming shows at `/shows`, picks one, hits **Request Spot**
3. Staff sees the request in `/admin/shows/[id]` and approves, rejects, or waitlists
4. Comedian receives an email notification with the decision (approved, rejected, or waitlisted)
5. On approval, the comic is auto-added to the lineup
6. Staff reorders the lineup, assigns roles, sets time lengths

## Routes

### Public

| Route | Description |
|---|---|
| `/` | Auth-aware homepage (personalized when logged in) |
| `/join` | Membership signup |
| `/perks` | Member benefits |
| `/m/[token]` | Digital member card with QR code |
| `/terms` | Terms of Service & Privacy Policy |
| `/shows` | Upcoming shows (comedian view) |
| `/shows/[id]` | Show detail + request spot |

### Staff (requires login)

| Route | Description |
|---|---|
| `/scan` | Camera QR scanner |
| `/door` | Search + manual check-in |
| `/admin` | Member management + CSV export |
| `/admin/shows` | Create and manage shows |
| `/admin/shows/[id]` | Requests queue + lineup builder |
| `/admin/comedians` | Comedian directory + approve/ban |

### Comedian (requires login)

| Route | Description |
|---|---|
| `/comedians/profile` | Edit profile |
| `/comedians/bookings` | Track spot requests |

### API

| Endpoint | Description |
|---|---|
| `POST /api/join` | Create member + send email/SMS |
| `GET /api/scan/m/[token]` | Look up member by token |
| `POST /api/checkin` | Log a check-in |
| `GET /api/members` | List all members |
| `GET /api/members/search?q=` | Search members |
| `PATCH /api/members/[id]` | Update member |
| `POST /api/members/[id]/rotate-token` | New membership token |
| `GET /api/members/export` | CSV export |
| `POST /api/comedians/signup` | Create comedian account |
| `GET/PATCH /api/comedians/me` | Comedian profile |
| `GET/POST/PATCH /api/shows` | Show CRUD |
| `GET/POST /api/requests` | Booking requests |
| `PATCH /api/requests/[id]` | Approve/reject/waitlist |
| `GET/PATCH/DELETE /api/lineup` | Lineup management |

## Database

7 tables with Row Level Security:

- **members** — profiles, tokens, statuses, contact info
- **checkins** — check-in log with staff attribution
- **comedians** — profiles linked to auth accounts
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

### Install

```bash
git clone https://github.com/AwkCode/kcp-membership.git
cd kcp-membership
npm install
```

### Configure

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
SENDGRID_API_KEY=your_sendgrid_key
SENDGRID_FROM_EMAIL=your_verified_email
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number
```

### Database

Run migrations in order in Supabase SQL Editor:

1. `supabase/migrations/001_create_tables.sql`
2. `supabase/migrations/002_checkin_notes.sql`
3. `supabase/migrations/003_comedian_portal.sql`
4. `supabase/migrations/004_show_eventbrite_url.sql`

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
