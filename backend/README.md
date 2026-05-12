# Backend / Supabase Setup Guide (Detailed)

This project uses **Supabase (PostgreSQL + Auth)** as the backend data/auth layer.
The frontend connects via `src/utils/supabase.js`.

`backend/server.js` is included as an **optional Express scaffold** and is not required for the current primary app flow.

---

## 1) Backend Folder Contents

- `full-schema.sql`  
  Creates core database objects (tables/policies/triggers if included) and seed data.
- `vehicle-migration.sql`  
  Adds vehicle filtering columns (vehicle_year, vehicle_make, vehicle_model) and sample data.
- `rls-fix.sql`  
  Applies additional grants/RLS policy fixes for authenticated CRUD access.
- `server.js`  
  Optional Node/Express API scaffold.
- `package.json`  
  Backend package/dependency manifest.
- `add_vehicle_filters.sql` / `update_parts_vehicle_schema.sql`  
  Alternative vehicle migration scripts (for reference).

---

## 2) Required Dependencies / Packages

These are required by the backend scaffold (`backend/package.json`):

### Runtime dependencies
- `express` — HTTP server framework
- `cors` — Cross-origin access control
- `@supabase/supabase-js` — Supabase client SDK
- `dotenv` — Loads `.env` variables
- `helmet` — Security headers middleware

### Development dependencies
- `nodemon` — Auto-restart server on file changes (dev mode)

Installed versions observed locally (`npm ls --depth=0`):
- `@supabase/supabase-js@2.105.3`
- `cors@2.8.6`
- `dotenv@16.6.1`
- `express@4.22.1`
- `helmet@7.2.0`
- `nodemon@3.1.14`

Install all backend dependencies:
```bash
cd backend
npm install
```

---

## 3) Required Platform / Tooling Versions

Recommended minimums:
- **Node.js**: `>=18.x` (LTS recommended)
- **npm**: `>=9.x`

Check your versions:
```bash
node -v
npm -v
```

---

## 4) Supabase Project Setup (Required)

1. Create/select Supabase project in dashboard.
2. Go to **Project Settings → API**.
3. Copy:
   - **Project URL** (SUPABASE_URL)
   - **anon/public key** (SUPABASE_ANON_KEY)
4. In Supabase Auth settings, for internal testing you can disable email confirmation:
   - **Authentication → Providers → Email → Confirm email = OFF**

---

## 5) Environment Variables

Create a `.env` file in `backend/`:

```env
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
PORT=5000
```

> Do **not** commit secret keys.  
> The `anon` key is expected for client-safe operations (with RLS).  
> Never expose `service_role` in frontend code.

---

## 6) SQL Execution Order (Critical)

Run scripts in **Supabase SQL Editor** in this exact order:

1. `backend/full-schema.sql` (creates tables and base seed data)
2. `backend/vehicle-migration.sql` (adds vehicle filtering columns and sample data)
3. `backend/rls-fix.sql` (RLS policies and permissions)

Why order matters:
- `full-schema.sql` ensures base schema/tables exist.
- `vehicle-migration.sql` adds vehicle filtering columns (vehicle_year, vehicle_make, vehicle_model)
- `rls-fix.sql` applies grant/policy corrections.

**Note:** This is a Toyota-only parts system. Make is hardcoded to "Toyota" in the frontend.

---

## 7) What `rls-fix.sql` Ensures

- Schema access grants for `anon/authenticated`
- Table grants for authenticated users
- RLS enabled on `public.parts`
- Policies for authenticated read/update/insert/delete (as defined in file)

Core examples:
```sql
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.parts TO authenticated;
ALTER TABLE public.parts ENABLE ROW LEVEL SECURITY;
```

---

## 8) Verification Queries (Supabase SQL Editor)

Run these after scripts:

```sql
-- 1) confirm parts table exists
select to_regclass('public.parts');

-- 2) confirm policies exist
select policyname, cmd, roles, qual, with_check
from pg_policies
where schemaname = 'public' and tablename = 'parts'
order by policyname;

-- 3) confirm grants
select grantee, privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name = 'parts'
order by grantee, privilege_type;
```

Expected:
- table resolves as `public.parts`
- authenticated policies present
- authenticated has required table privileges

---

## 9) Auth Behavior in This App

- UI collects **Worker ID + Password**
- Worker ID is converted to pseudo-email for Supabase auth:
  - `workerid@umanskytoyota.com`
- Role behavior in UI:
  - employee: read-only constraints in manager-only actions
  - manager: can perform create/edit/delete flows

---

## 10) Run Commands

### Frontend (main app)
From repo root:
```bash
npm install
npm run dev
```

### Optional backend scaffold
In separate terminal:
```bash
cd backend
npm install
npm run dev
```

---

## 11) Troubleshooting

### A) `permission denied for table parts`
Possible causes:
1. SQL scripts not run in Supabase SQL Editor
2. Executed out of order
3. Session token is stale after policy changes
4. Wrong project URL/anon key
5. User is unauthenticated

Fix:
- Re-run SQL in correct order
- Sign out/sign in to refresh auth token
- Verify env values and active Supabase project

### B) Signup/login works inconsistently
- Check Auth provider settings in Supabase
- For testing, disable email confirmation
- Ensure worker ID mapping logic matches your auth implementation

### C) VSCode SQL shows parser errors
- Some VSCode SQL extensions parse T-SQL by default.
- Supabase uses **PostgreSQL** syntax.
- Validate SQL by executing in Supabase SQL Editor directly.

---

## 12) Security Notes

- Keep RLS enabled on data tables.
- Prefer least-privilege policies.
- Do not use `service_role` key in browser/client code.
- Store sensitive keys only in server-side env files/secrets manager.

---

## 13) Quick Validation Checklist

- [ ] Supabase URL/anon key configured
- [ ] `full-schema.sql` executed
- [ ] `vehicle-migration.sql` executed
- [ ] `rls-fix.sql` executed
- [ ] User can sign in
- [ ] Employee can read/search/view parts with vehicle filtering
- [ ] Manager can create/edit/delete part
- [ ] Vehicle filtering (Year + Model) works in UI
- [ ] No permission errors in console/network
