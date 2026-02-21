# Honestify

A Next.js app for **anonymous feedback**: users get a personal feedback page (e.g. `yoursite.com/username`) where others can send anonymous messages. Feedback is moderated via an admin dashboard before it appears on the user’s dashboard.

## Tech stack

- **Next.js 16** (App Router)
- **Prisma 7** with PostgreSQL (`@prisma/adapter-pg` + `pg`)
- **Auth:** JWT (login/signup), `jose` in middleware (Edge), `jsonwebtoken` for login API, bcrypt for passwords
- **Styling:** Tailwind CSS 4

## Prerequisites

- Node.js 18+
- PostgreSQL (local or hosted, e.g. Neon, Supabase)
- For hosted Postgres, add `?sslmode=require` to `DATABASE_URL` if required

## Environment variables

Create a `.env` file in the project root:

| Variable        | Description |
|----------------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (e.g. `postgresql://user:pass@host:5432/dbname`) |
| `JWT_SECRET`   | Secret used to sign and verify login JWTs |
| `ADMIN_EMAIL`  | Email of the admin user; only this user can access `/admin` and moderate feedback |

Example (do not commit real secrets):

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/honestify-me"
JWT_SECRET="your-secret"
ADMIN_EMAIL="admin@example.com"
```

## Database setup and migrations

The project uses **Prisma 7** with a root-level config and schema in `prisma/`.

1. **Schema and config**
   - Schema: `prisma/schema.prisma`
   - Config: `prisma.config.ts` (reads `DATABASE_URL`, migrations in `prisma/migrations`)

2. **Generate the Prisma client** (required after clone or schema change):

   ```bash
   npm run db:generate
   ```
   Or: `npx prisma generate`. The client is generated into `src/generated/prisma`.

3. **Run migrations** (creates/updates DB tables):

   - **Production / CI:** apply existing migrations only  
     `npm run db:migrate:deploy` (or `npx prisma migrate deploy`)
   - **Local development:** apply migrations and create new ones if needed  
     `npm run db:migrate:dev` (or `npx prisma migrate dev`)

   Migrations live in `prisma/migrations/` (e.g. `init`, `add_user_full_name`, `make_full_name_required`, `remove_full_name_default`).

4. **Optional:** Open Prisma Studio to inspect data:

   ```bash
   npx prisma studio
   ```

## Development setup

1. **Clone and install**

   ```bash
   cd honestify-me
   npm install
   ```

2. **Configure environment**

   Copy or create `.env` with `DATABASE_URL`, `JWT_SECRET`, and `ADMIN_EMAIL` as above.

3. **Generate Prisma client and run migrations**

   ```bash
   npm run db:generate
   npm run db:migrate:dev
   ```
   Use `db:migrate:deploy` in production/CI instead of `db:migrate:dev`.

4. **Start the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Main routes and features

| Route | Description |
|-------|-------------|
| `/` | Landing; Sign up / Login. Logged-in users are redirected to `/dashboard`. |
| `/signup` | Create account (email, username, password; full name optional, falls back to username). |
| `/login` | Sign in; returns JWT and username. |
| `/dashboard` | User dashboard (requires login): share feedback link (`/username`), view **approved** feedback only. |
| `/[username]` | Public feedback page for a user; anyone can submit anonymous feedback (pending until approved). |
| `/admin` | **Admin dashboard** (see below). |

APIs used: `/api/login`, `/api/signup`, `/api/feedback`, `/api/dashboard`, `/api/admin/pending-feedback`, `/api/moderation`.

## Admin dashboard

- **URL:** `/admin`
- **Access:** Only the user whose email matches `ADMIN_EMAIL` can open `/admin`. Others are redirected to `/login`. The middleware and all admin APIs check the JWT and `ADMIN_EMAIL`.
- **Purpose:** View **pending** feedback from all users (oldest first) and approve or reject each item.
- **Actions:** Approve → feedback becomes visible on the recipient’s dashboard; Reject → it is not shown.
- **Navigation:** “← Dashboard” links back to `/dashboard`.

To use the admin dashboard, ensure the account you use to log in has the same email as `ADMIN_EMAIL` in `.env`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Generate Prisma client and production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma client only |
| `npm run db:migrate:dev` | Apply migrations in dev (can create new migrations) |
| `npm run db:migrate:deploy` | Apply migrations in prod/CI (existing migrations only) |

## Deploy

Set `DATABASE_URL`, `JWT_SECRET`, and `ADMIN_EMAIL` in your deployment environment. Run `npm run db:generate` and `npm run db:migrate:deploy` as part of the build or release step (build already runs `prisma generate`), then start the app with `npm run start` (or your host’s equivalent). For Next.js deployment details see [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying).
