# PortfolioAI

Upload resume. Get a portfolio. That's it.

## Setup

1. **Environment**  
   Copy `.env.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY`
   - `GEMINI_API_KEY`
   - `NEXT_PUBLIC_APP_URL` (e.g. `http://localhost:3000`)
   - `NEXT_PUBLIC_PORTFOLIO_DOMAIN` (e.g. `portfolioai.app`)

2. **Database**  
   Run the SQL in `supabase-migration.sql` in your Supabase project’s SQL editor to create the `portfolios` table.

3. **Run**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000), drop a PDF or Word resume, and get a portfolio at `/p/[subdomain]`.

## Project layout

- **Landing** — `app/page.tsx` (upload zone + loading overlay)
- **Live portfolio** — `app/p/[subdomain]/page.tsx` (renders from Supabase + component registry)
- **APIs** — `app/api/parse-resume`, `app/api/generate-layout-config`, `app/api/portfolios`
- **Components** — `components/elements/` (hero, nav, experience, projects, skills, contact, footer, etc.)
- **Config** — `lib/elementLibrary.ts` (element metadata + color palettes), `lib/componentRegistry.tsx` (element ID → component)

Nothing is stored or run from C drive; the app and `node_modules` live on E.
