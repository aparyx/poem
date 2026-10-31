# The Unquiet Archive

A literary archive for Ad. The public pages are static HTML/CSS/JavaScript. Cloudflare Pages Functions provide the private writing API, and Cloudflare D1 stores entries.

## Pages
- `index.html`: landing page
- `archive.html`: category browsing and search
- `entry.html?id=<slug>`: individual published entry
- `search.html`: dedicated search
- `admin/`: private author dashboard
- `404.html`: custom not-found page

## Cloudflare Pages setup

The private library requires Cloudflare configuration before it can be used. No password or session secret is stored in this repository.

1. In Cloudflare, open Workers & Pages and connect this GitHub repository as a Pages project. Use `main` as the production branch, leave the build command empty, and set the build output directory to `.` (repository root).
2. Create a D1 database, for example named `unquiet-archive`.
3. In the Pages project settings, add a D1 database binding named **DB** and select that database.
4. Apply the SQL in `migrations/0001_initial.sql` to the D1 database using its Console, or Wrangler:
   `npx wrangler d1 execute unquiet-archive --remote --file=migrations/0001_initial.sql`
5. In Pages project Settings > Variables and Secrets, create these as **encrypted secrets** for Production (and Preview too if you want preview login):
   - `ADMIN_PASSWORD`: the passphrase you want to use for the private library
   - `SESSION_SECRET`: a separate, randomly generated secret of at least 32 random bytes. Do not reuse your login passphrase.
6. Trigger a new deployment after adding the binding and secrets.
7. Visit `/admin/` on the deployed site.

## Private library security

- Passphrase verification happens in a Pages Function. The browser never receives the configured passphrase.
- The login session is an HMAC-signed, eight-hour cookie with Secure, HttpOnly and SameSite=Strict attributes.
- Write operations require a valid session and same-origin request.
- Failed logins are limited to eight attempts per IP per 15-minute window using D1.
- Drafts are only returned by the authenticated API. The public API returns published entries only.
- Entry bodies are limited to 50,000 characters. IDs use lowercase URL-safe slugs.
- This is designed for one author, not multiple accounts or public registration.

## Important
A Git merge alone cannot create your Cloudflare D1 database or add encrypted Cloudflare secrets. Until the Cloudflare steps above are completed, `/admin/` will show that the private library is not configured. Do not put credentials in GitHub files, commits, or Pages build variables that are exposed to client-side code.

## Content workflow
Open `/admin/`, sign in, create a piece, choose a category, and save it as a draft. Tick “Publish to public archive” only when it is ready. Drafts stay in D1 and are not sent by the public API.
