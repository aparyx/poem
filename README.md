# The Unquiet Archive

A minimal literary archive for Ad. The public site is static HTML, CSS and vanilla JavaScript. No framework or build step is required.

## Public pages

- `index.html`: landing page and author note
- `archive.html`: category filters and full-text search
- `entry.html?id=<id>`: individual reading page
- `search.html`: dedicated search page
- `data/entries.json`: published writing records

## Adding a published entry

Add an object to `data/entries.json`:

```json
{
  "id": "a-unique-lowercase-slug",
  "title": "The title",
  "subtitle": "",
  "category": "poetry",
  "date": "2026-10-31",
  "excerpt": "A short description for the archive index.",
  "tags": ["memory", "winter"],
  "readingTime": 2,
  "status": "published",
  "body": "The complete text goes here.\n\nSeparate paragraphs with a blank line."
}
```

Allowed categories: `poetry`, `fiction`, `essays`, `fragments`. Only records with `status: "published"` appear publicly. Do not put private drafts or personal data in this public JSON file.

## Security boundary

This repository currently contains a public static site. A client-side password or hidden admin page is **not** secure authentication. A real private writing dashboard requires a server-side identity provider, protected API, and private database/storage. Those deployment-specific pieces are intentionally not simulated in browser JavaScript. Before enabling the dashboard, choose the hosting/authentication provider and configure its secrets outside the repository (never commit credentials).

## Deployment

The site can be served by any static host that preserves the repository's folder structure. Configure the site root as the repository root. Keep the current production branch unchanged until preview and deployment checks are complete.
