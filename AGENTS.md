# AGENTS.md

Personal finance tracker: React SPA + Express/SQLite REST API. All UI text, code comments, and
error messages in the repo are **Russian** — keep new ones Russian to match.

## Layout: two independent npm projects, no root package.json

| Path | Stack | Commands (run inside that dir) |
|---|---|---|
| `client/` | React 19 + Vite 8 + react-router-dom 7 + Recharts + **Tailwind CSS v4** | `npm run dev` (5173), `npm run build`, `npm run lint` |
| `server/` | Express 4 + `sqlite3`/`sqlite` + bcrypt + JWT (ESM, `"type": "module"`) | `npm start` (= `node index.js`), `npm run dev` (nodemon) |

There are **no tests, no typecheck, no formatter, and no CI** in this repo. There is no
workspaces/concurrently setup — install and run each side separately in its own terminal.

- Backend listens on `PORT` (default 3001). Health: `GET /health`. Everything else under `/api/v1`.
- CORS origin is `CLIENT_URL` (default `http://localhost:5173`) — see `server/src/config/index.js`.
- `README.md` is stale (claims React 18; versions live in the two `package.json` files) and its
  setup section is truncated. Trust `package.json` + code.

## Gotchas that will bite you

- **`.env` is decorative.** `client/.env` sets `VITE_API_URL`, but nothing reads it: the base URL is
  hardcoded at `client/src/services/api.js:2`. There is no Vite proxy. To point the app elsewhere you
  must edit `api.js` (or switch it to `import.meta.env.VITE_API_URL`).
- **`server/node_modules/` and `server/salary_tracker.db` are committed** (2261 + 1 tracked files;
  `client/node_modules` is ignored, `server/` has no `.gitignore` at all). Be careful with
  `git add -A` / `git commit -a` and never commit DB or dependency churn from `server/`.
- **`server/src/db/schema.sql` and `usersSchema.js` are dead and misleading.** Real schema is the
  inline `CREATE TABLE IF NOT EXISTS` in `server/src/db/connection.js:22-62` (with `user_id`,
  `ON DELETE CASCADE`). `schema.sql` still shows the pre-auth shape (no `user_id`) — do not edit it
  expecting a behavior change.
- **`server/src/db/migrate.js` is destructive and one-off** (`node src/db/migrate.js`): it
  `DROP TABLE`s `incomes`/`expenses` to add `user_id`. Never wire it into startup; existing data is lost.
- `npm run lint` (oxlint) reports **9 warnings** and exits 0 — that is the current baseline
  (2 `Analytics`, 2 `AuthContext`, 2 `TransactionForm`, 1 `History`, 1 `Dashboard`, 1 `ThemeContext`).
  Warnings are the baseline, not something you broke.
- **Styling is Tailwind v4 only — CSS Modules are gone.** All `*.module.css`, `App.css`,
  `styles/global.css` and `components/Layout/` were deleted. Do not re-introduce them.
- **There is no `tailwind.config.js`** — v4 is configured CSS-first in `client/src/index.css`:
  `@import "tailwindcss" source(none)`, `@custom-variant dark`, `@theme inline` (semantic tokens) and
  `@theme` (animations). Plugin lives in `client/vite.config.js`.
- **Scanning is explicitly restricted** to `@source "./**/*.{js,jsx}"` + `@source "../index.html"`.
  A new file outside those globs gets **no** utility classes and renders unstyled — add a glob if you
  add a source dir. This restriction is deliberate: the repo has a committed `server/node_modules`.
- Use **semantic** utilities (`bg-surface`, `text-secondary`, `border-border`, `shadow-card`,
  `text-accent`, `bg-primary-soft`) instead of raw palette colors (`bg-slate-800`) — that is what makes
  dark mode work. Tokens are plain CSS vars (`--surface`, `--border`, …), not `--color-*`.
- **CSS variables do not resolve in SVG presentation attributes** (`fill="var(--text)"` is invalid).
  For Recharts/SVG use `const { isDark } = useTheme()` and branch on hex colors — see
  `PieChart.jsx:28` / `BarChart.jsx:28`. Prefer shared pieces from `components/ChartShared/ChartShared.jsx`.
- Custom animations live in `@theme`: `animate-fade-in`, `animate-rise` (page transitions),
  `animate-pop` (modals), `animate-float`, `animate-shimmer`. The `prefers-reduced-motion` block in
  `index.css` disables them.
- **Theming contract:** `context/ThemeContext.jsx` (`ThemeProvider`, `useTheme`, `isDark`, `toggleTheme`)
  toggles `.dark` on `<html>` and persists the choice in `localStorage["theme"]`; with no saved choice
  it follows `prefers-color-scheme` live. An inline script in `index.html` applies the class before
  React boots (FOUC guard) — keep it as the first thing in `<head>`. The toggle UI is
  `components/ThemeToggle/ThemeToggle.jsx`, rendered by `Header` and by `Login`/`Register`.
- **Two different modal implementations.** `components/Modal/Modal.jsx` is Tailwind-styled, takes
  `isOpen` (default `true`, so Dashboard's `{isFormOpen && <Modal onClose={...}>}` keeps working),
  closes on `×`, `Escape` and backdrop click, and renders an optional `title`.
  `ConfirmModal` (History) and `ConfirmDialog` (Dashboard) are two separate copies of the same dialog.
- Dead client code (safe to ignore unless asked to clean up): `services/storage.js` is imported by
  nothing.

## Architecture rules to preserve

**Server** (`routes/` → `controllers/` → `services/` → `getDb()`):
- Every transaction service function takes `userId` as its **first argument** and every SQL statement
  must filter `WHERE user_id = ?`. This is the data-isolation invariant — see
  `server/src/services/incomeService.js:29-70`. Never add a query that takes only an `id`.
- `authenticate` is applied per route group in `server/src/app.js:39-42`, not globally.
- Throw `Error` with `.statusCode` and `.code` attached; `middleware/errorHandler.js` renders
  `{ error: { code, message } }`. There is no validation library — write/extend
  `middleware/validate.js`.
- DB rows are snake_case; services map to camelCase via `mapRowTo*` and tag each transaction with
  `type: 'income' | 'expense'` (that discriminator is how the client merges the two lists).
- Validation requires `amount > 0`, `date` as `YYYY-MM-DD`, and a category present in
  `server/src/utils/categories.js`. That list is **duplicated** in `client/src/utils/constants.js`
  (plus `CATEGORY_ICONS`) — changing categories means editing both files.

**Client** (`pages/` → `services/` → `services/api.js`):
- All HTTP goes through the `get/post/put/del` wrappers in `services/api.js`; they attach
  `Authorization: Bearer <token>` from `localStorage['auth_token']`. CSV export is the one exception
  (`Header.jsx` uses raw `fetch` for the Blob download).
- Session lives in `context/AuthContext.jsx` (`localStorage` keys `auth_token`, `auth_user`);
  route guards are `ProtectedRoute` / `PublicRoute` in `App.jsx`.
- Note `api.js` reads `data.message || data.error` while the server sends `{ error: { message } }`,
  so API error messages currently surface as `[object Object]`. If you change the response envelope,
  fix both sides.
- One component per directory under `components/`, JSX + Tailwind utilities inline. No `.css` files.
- Service layer is partially duplicated: `services/transactionService.js` (used by `Dashboard`)
  overlaps `incomeService.js` / `expenseService.js` (used by `History`). Match the file the calling
  page already imports instead of adding a third variant.

## Verified bugs (pre-existing, safe to leave alone unless asked)

- `/summary/by-category` returns `{ category, total, count }`, but `client/src/services/summaryService.js:101`
  reads `item.label` → every analytics pie slice is labeled "Прочее" (re-confirmed in the browser).
- `registerUser` checks duplicates with the raw email but inserts `email.toLowerCase().trim()`
  (`server/src/services/userService.js:36,54`) → registering `A@b.com` after `a@b.com` hits the
  UNIQUE constraint and surfaces as a 500 instead of a 409.

## Verifying changes

No test suite exists. Minimum checks:

1. `npm run lint` in `client/` (expect only the baseline warnings).
2. `npm start` in `server/`, then `curl http://localhost:3001/health`.
3. `npm run build` in `client/` for anything touching the frontend.
4. Authenticated flows need a real token: `POST /api/v1/auth/register` → `{ token }`, then send
   `Authorization: Bearer <token>` (unauthenticated requests to `/incomes`, `/expenses`, `/summary`,
   `/export` return 401 and the SPA force-redirects to `/login`).

Browser checks without `agent-browser` (it is not installed): drive the installed Chrome over CDP —
`chrome.exe --headless=new --remote-debugging-port=<p>`, then `fetch('http://127.0.0.1:<p>/json')` +
`WebSocket` → `Page.navigate` / `Runtime.evaluate` (`returnByValue: true`). Two traps:

- **Serve the client on port 5173.** `CLIENT_URL` defaults to `http://localhost:5173`, so a dev server
  on any other port fails CORS and every API call dies — `Dashboard`/`Analytics` then `alert()` on
  failure and a blocking `alert` freezes the renderer, so all further `Runtime.evaluate` calls time out.
- **Back up `server/salary_tracker.db` before seeding test data** (it is tracked by Git) and restore
  the copy afterwards.

Headless Chrome inherits the OS colour scheme, so `prefers-color-scheme` may start as dark; set
`localStorage['theme']` explicitly when you need a deterministic starting theme.