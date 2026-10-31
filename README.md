# The Unquiet Archive

A personal literary library for poems, fiction, and fragments. Public reading pages run on Cloudflare Pages. The private author room uses Pages Functions and Cloudflare D1.

## Add your writing

Visit `/admin/` on the live site and sign in. Choose **New piece**, enter a title, choose Poetry, Fiction, or Fragments, paste the complete writing, then save it as a draft. Enable **Publish to public archive** only when you want readers to see it. You can return to edit or delete a piece later. Drafts are never returned by the public API.

You can also send a poem or story to the site maintainer in this chat and ask for it to be added. Confirm its title, category, date, and whether it should be published or kept as a draft.

## Cloudflare setup

The Pages project is connected to GitHub repository `aparyx/poem`, with `main` as production branch and an empty build command. The D1 database binding is named `DB`.

Required encrypted Pages secrets:
- `ADMIN_PASSWORD`: your private author-room passphrase.
- `SESSION_SECRET`: a separate random secret with at least 32 bytes of entropy. Never reuse the passphrase.

Create these under Pages > Settings > Variables and Secrets for Production (and Preview if needed). Do not put either value in this repository.

## Security notes

- The passphrase is checked only by a server-side Pages Function.
- Sessions use an HMAC-signed eight-hour cookie marked Secure, HttpOnly, and SameSite=Strict.
- Write requests require a valid session and same-origin origin.
- Login failures are rate-limited using D1.
- Public endpoints return published entries only.
- The dashboard is intended for one author, not public accounts.

## Licensing

The original website code is MIT-licensed. The poems, fiction, and fragments are not included in that license and remain the author's work. See [RIGHTS.md](./RIGHTS.md) for the font and content rights summary.
