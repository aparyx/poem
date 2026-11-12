const ORIGIN = "https://aprashanna.com.np";

const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[c]));

const categoryLabel = (value) => ({
  poetry: "Poetry", fiction: "Fiction", fragments: "Fragments"
}[value] || "Writing");

export async function onRequestGet({ params, env }) {
  if (!env.DB) return new Response("Archive temporarily unavailable.", { status: 503 });
  const id = String(params.id || "");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) return new Response("Not found.", { status: 404 });
  const entry = await env.DB.prepare(
    "SELECT id,title,subtitle,category,date,excerpt,tags,body FROM entries WHERE id=? AND status='published' LIMIT 1"
  ).bind(id).first();
  if (!entry) return new Response("Not found.", { status: 404 });

  const title = esc(entry.title);
  const description = esc((entry.excerpt || entry.subtitle || entry.body || "").replace(/\s+/g, " ").slice(0, 155));
  const url = ORIGIN + "/entry/" + encodeURIComponent(entry.id);
  const category = categoryLabel(entry.category);
  const paragraphs = String(entry.body || "").split(/\n\s*\n/).map((p) =>
    "<p>" + esc(p).replace(/\n/g, "<br>") + "</p>"
  ).join("");
  const tags = (() => { try { return JSON.parse(entry.tags || "[]"); } catch { return []; } })();
  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": entry.title,
    "text": entry.body,
    "genre": category,
    "author": { "@type": "Person", "name": "Ad" },
    "url": url,
    ...(entry.date ? { "datePublished": entry.date } : {}),
    ...(tags.length ? { "keywords": tags.join(", ") } : {})
  };
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#151512"><meta name="description" content="${description}">
<link rel="canonical" href="${url}"><meta property="og:type" content="article"><meta property="og:site_name" content="The Unquiet Archive">
<meta property="og:title" content="${title} — The Unquiet Archive"><meta property="og:description" content="${description}"><meta property="og:url" content="${url}">
<meta name="twitter:card" content="summary"><meta name="twitter:title" content="${title} — The Unquiet Archive"><meta name="twitter:description" content="${description}">
<title>${title} — The Unquiet Archive</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/styles.css?v=20261101content"><link rel="stylesheet" href="/css/pages.css?v=20261101content">
<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script></head>
<body><a class="skip" href="#main">Skip to content</a><header class="header"><a class="brand" href="/">ad<span>.</span></a>
<button class="menu" aria-expanded="false" aria-controls="nav">MENU <b>☰</b></button><nav id="nav"><a href="/archive.html">THE ARCHIVE</a><a href="/#manifesto">A NOTE</a><a href="/#about">ABOUT</a></nav></header>
<main id="main" class="wrap reader"><a class="back-link" href="/archive.html">← RETURN TO THE ARCHIVE</a><article>
<p class="micro">${esc(category.toUpperCase())}</p><h1>${title}</h1>${entry.subtitle ? '<p class="entry-subtitle">' + esc(entry.subtitle) + '</p>' : ''}
<p class="entry-info">${esc(entry.date || "")}</p><div class="entry-body">${paragraphs}</div>
${tags.length ? '<p class="micro">THEMES · ' + tags.map(esc).join(' / ') + '</p>' : ''}</article>
<div class="reader-end"><span>— AD</span><a class="text-link" href="/archive.html">CONTINUE READING ↗</a></div></main>
<footer class="footer wrap"><a class="brand" href="/">ad<span>.</span></a><span>AN ARCHIVE OF WORDS & OTHERWISE</span><span>© <b>2026</b> AD</span></footer>
<script src="/js/main.js?v=20261101content" defer></script></body></html>`;
  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=60, s-maxage=300",
      "x-content-type-options": "nosniff",
      "referrer-policy": "no-referrer",
      "x-frame-options": "DENY",
      "strict-transport-security": "max-age=31536000; includeSubDomains",
      "content-security-policy": "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self'; upgrade-insecure-requests"
    }
  });
}
