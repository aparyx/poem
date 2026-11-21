const ORIGIN = "https://aprashanna.com.np";
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[c]));

export async function onRequestGet({ env }) {
  if (!env.DB) return new Response("Archive temporarily unavailable.", { status: 503 });
  const { results = [] } = await env.DB.prepare(
    "SELECT id,title,subtitle,category,date,excerpt FROM entries WHERE status='published' ORDER BY date DESC, updated_at DESC"
  ).all();

  const cards = results.map((entry) => `<a class="entry-card" href="/entry/${encodeURIComponent(entry.id)}">
    <span class="entry-meta">${esc((entry.category || "").toUpperCase())} · ${esc(entry.date || "")}</span>
    <span><h2>${esc(entry.title)}</h2><p>${esc(entry.excerpt || entry.subtitle || "")}</p></span>
    <span class="entry-arrow" aria-hidden="true">↗</span>
  </a>`).join("");

  const description = "Browse original poetry, fiction, and fragments in The Unquiet Archive by Ad. Explore writing on memory, loneliness, love, belief, and the human condition.";
  const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#151512"><meta name="description" content="${esc(description)}">
<link rel="canonical" href="${ORIGIN}/archive">
<meta property="og:type" content="website"><meta property="og:site_name" content="The Unquiet Archive">
<meta property="og:title" content="The Archive — The Unquiet Archive"><meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${ORIGIN}/archive"><meta name="twitter:card" content="summary">
<meta name="twitter:title" content="The Archive — The Unquiet Archive"><meta name="twitter:description" content="${esc(description)}">
<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "The Archive — The Unquiet Archive",
    "url": ORIGIN + "/archive",
    "description": description,
    "isPartOf": { "@type": "WebSite", "name": "The Unquiet Archive", "url": ORIGIN + "/" },
    "mainEntity": { "@type": "ItemList", "numberOfItems": results.length, "itemListElement": results.map((entry, index) => ({
      "@type": "ListItem", "position": index + 1, "url": ORIGIN + "/entry/" + encodeURIComponent(entry.id), "name": entry.title
    })) }
  }).replace(/</g, "\\u003c")}</script>
<title>The Archive — The Unquiet Archive</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400;1,6..72,500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/styles.css?v=20261116psych01"><link rel="stylesheet" href="/css/pages.css?v=20261116photo02">
<link rel="alternate" type="application/rss+xml" title="The Unquiet Archive — RSS" href="/feed.xml">
<script src="/js/archive.js" defer></script></head><body>
<a class="skip" href="#main">Skip to content</a>
<header class="header"><a class="brand" href="/">ad<span>.</span></a><button class="menu" aria-expanded="false" aria-controls="nav">MENU <b>☰</b></button>
<nav id="nav"><a href="/archive">THE ARCHIVE</a><a href="/paths">DISCOVER</a><a href="/#manifesto">A NOTE</a><a href="/#about">ABOUT</a><a href="https://discord.com/users/1367853427375214646" target="_blank" rel="noopener noreferrer">CONTACT / DISCORD ↗</a></nav></header>
<main id="main" class="wrap page-shell">
<div class="page-kicker"><span>THE UNQUIET ARCHIVE</span><span>01 / THE COLLECTION</span></div>
<div class="page-heading"><p class="micro">THE SHELVES</p><h1>Words that<br><i>stay.</i></h1><p class="page-intro">Browse the collection by shelf, or search for a word that has been following you.</p></div>
<form class="search-form" role="search"><label class="sr-only" for="search">Search the archive</label><input id="search" type="search" placeholder="Search titles, writing, or themes…" autocomplete="off"><button type="submit" aria-label="Search">↗</button></form>
<div class="filters" aria-label="Filter by category"><button class="filter active" data-filter="all">ALL</button><button class="filter" data-filter="poetry">POETRY</button><button class="filter" data-filter="fiction">FICTION</button><button class="filter" data-filter="fragments">FRAGMENTS</button></div>
<div class="archive-tools"><p class="result-count" id="count" aria-live="polite">${results.length} PUBLISHED ${results.length === 1 ? "PAGE" : "PAGES"}</p><a class="text-link" href="/search.html">OPEN FULL SEARCH ↗</a></div>
<section class="entry-list" id="entries" aria-live="polite">${cards || '<p class="page-intro">No published writing here yet.</p>'}</section>
<div class="empty-state" id="empty" hidden><span class="empty-mark">∅</span><h2>The shelf is quiet.</h2><p>No published writing here yet. The empty space is intentional. No words will be invented to fill it.</p><a class="text-link" href="/">BACK TO THE BEGINNING ↑</a></div>
</main>
<footer class="footer wrap"><a class="brand" href="/">ad<span>.</span></a><span>AN ARCHIVE OF WORDS & OTHERWISE</span><span>© <b id="year">2026</b> AD</span><a class="rss-link" href="/feed.xml">FOLLOW VIA RSS ↗</a><a class="discord-link" href="https://discord.com/users/1367853427375214646" target="_blank" rel="noopener noreferrer">CONTACT VIA DISCORD ↗</a></footer>
<script src="/js/main.js?v=20261115editorial" defer></script></body></html>`;
  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=60, must-revalidate",
      "x-content-type-options": "nosniff",
      "referrer-policy": "no-referrer",
      "x-frame-options": "DENY",
      "strict-transport-security": "max-age=31536000; includeSubDomains",
      "content-security-policy": "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; frame-src https://www.googletagmanager.com; form-action 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com; upgrade-insecure-requests"
    }
  });
}
