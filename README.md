# Umansky Toyota Parts Department System

Frontend inventory/search/cart system using **React + Vite** with **Supabase Auth + Postgres** as the live backend.

## Current Architecture

- **Frontend:** React (Vite)
- **Database/Auth:** Supabase (Postgres + Supabase Auth)
- **Data access pattern:** Frontend connects directly to Supabase using `@supabase/supabase-js`
- **Optional backend folder:** `backend/server.js` exists as optional proxy scaffold (not required for current flow)

## Features Implemented

- Worker ID sign-in/sign-up UI
- Supabase auth session restore on refresh
- Role metadata stored on signup (`employee` / `manager`)
- Parts loaded from Supabase table `public.parts`
- Search + category filtering
- **Vehicle filtering by Year + Model** (Toyota-specific)
- Part detail view with edit capability for managers
- Manager-side part updates persisted to Supabase
- Quote cart (add/update/remove/clear/print)

## Repository Structure

- `src/` → frontend app
- `src/utils/supabase.js` → Supabase client initialization
- `backend/full-schema.sql` → base schema + seed data
- `backend/vehicle-migration.sql` → adds vehicle_year, vehicle_make, vehicle_model columns
- `backend/rls-fix.sql` → RLS + permission fix for `parts` table
- `backend/update_parts_vehicle_schema.sql` → alternative vehicle schema + sample data
- `backend/README.md` → detailed backend/Supabase DB setup instructions

## Prerequisites

- Node.js 18+
- npm
- Supabase project

## 1) Supabase Setup

### A. Create project
Create a Supabase project in the dashboard.

### B. Run schema
Open **Supabase SQL Editor** and run in this order:
1. `backend/full-schema.sql` (creates tables and seed data)
2. `backend/vehicle-migration.sql` (adds vehicle filtering columns and data)
3. `backend/rls-fix.sql` (RLS policies and permissions)

### C. Auth setting (important for local/internal testing)
Go to **Authentication → Providers → Email**:
- Turn **OFF** “Confirm email” (recommended for this internal demo/workflow)

If left ON, new users must confirm email before login.

## 2) Frontend Environment Variables

Create `.env` in project root:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_OR_PUBLISHABLE_KEY
```

Notes:
- Use your project URL from Supabase Settings → API.
- Use anon/publishable key for client-side frontend.
- Do **not** put `service_role` key in frontend env.

## 3) Install and Run

```bash
npm install
npm run dev
```

Vite default is usually `http://localhost:5173` (or next available port).

## Worker ID Authentication Behavior

UI collects Worker ID + password.
Internally, Worker ID is mapped to an email format for Supabase auth:
- `EMP-9001` → `emp-9001@umanskytoyota.com`

This keeps UX worker-ID based while satisfying Supabase email auth.

## Common Issues & Fixes

### 1) `permission denied for table parts`
Cause: missing grants/policies or RLS mismatch.

Fix:
1. Run `backend/rls-fix.sql` in Supabase SQL Editor.
2. Sign out and sign in again.
3. Refresh app.

### 2) “Please confirm your email”
Cause: email confirmation enabled in Supabase auth settings.

Fix:
- Disable confirm-email in Supabase Email provider settings (for this project workflow), or manually confirm users in dashboard.

### 3) “Email rate limit exceeded”
Cause: too many signup attempts in short period.

Fix:
- Wait 60–120 seconds.
- Delete stale/unconfirmed users in Supabase Auth → Users.
- Retry once with a fresh worker ID.

## Lint / SQL Editor Notes

Some VSCode SQL extensions parse files as SQL Server/T-SQL and show syntax errors for Postgres features (`CREATE POLICY`, `auth.uid()`, etc.).
- These warnings are editor-parser mismatches.
- Execute SQL in Supabase SQL Editor for authoritative validation.

## Quick Start (Copy/Paste)

1. Run SQL files in Supabase (in this order):
   - `backend/full-schema.sql` (creates tables and seed data)
   - `backend/vehicle-migration.sql` (adds vehicle filtering columns)
   - `backend/rls-fix.sql` (RLS policies and permissions)
2. Create root `.env` with `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
3. `npm install`
4. `npm run dev`
5. Sign up with Worker ID (e.g. `EMP-9001`) and password
6. Sign in and verify parts load with vehicle filtering

## Vehicle Filtering Notes

- The app supports filtering parts by **Year** (2025-2018) and **Model** (Camry, Corolla, RAV4, Tacoma, etc.)
- Make is hardcoded to "Toyota" (this is a Toyota-only parts system)
- Vehicle fields in DB: `vehicle_year`, `vehicle_make`, `vehicle_model`
- Run `backend/vehicle-migration.sql` to populate vehicle data from existing `compatible_models`

## Status

Project is Supabase-backed and functional; current priority is completing full end-to-end test passes after DB policy confirmation.
