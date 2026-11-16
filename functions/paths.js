const ORIGIN = "https://aprashanna.com.np";
const PATHS = [
  { title: "Love, Belief & Letting Go", note: "Three pieces about what we believe, what hurts, and what it takes to begin again.", image: "https://images.unsplash.com/photo-1755401106338-fb095e1e3399?auto=format&fit=crop&w=900&q=80", imageAlt: "A dried flower resting on a stack of old books", credit: "Anya Chernykh / Unsplash", creditUrl: "https://unsplash.com/photos/dried-flower-resting-on-old-books-TjKvUi3Udx0", ids: ["love-rests-upon-belief-20261109", "the-broken-man", "another-beginning-20261115"] },
  { title: "The Weight of Being Human", note: "From feeling like nothing to asking what makes us human.", image: "https://images.unsplash.com/photo-1756993263826-9b4bae15e2b2?auto=format&fit=crop&w=900&q=80", imageAlt: "An old desk with an inkwell and scattered papers", credit: "K. K. / Unsplash", creditUrl: "https://unsplash.com/photos/old-desk-with-books-inkwell-and-papers-znh0IwsP4kU", ids: ["a-man-with-nothing", "the-sin-we-hate", "what-a-life-we-live", "when-a-human-loses-his-tears", "the-cruelty-of-kindness"] },
  { title: "The Quiet Things We Carry", note: "Clouds, dreams, and the thoughts that don't quite leave.", image: "https://images.unsplash.com/photo-1520052600632-67420194a58f?auto=format&fit=crop&w=900&q=80", imageAlt: "A shaded path through a forest", credit: "Jeff Finley / Unsplash", creditUrl: "https://unsplash.com/photos/forest-trees-with-pathway-FfGSxv4lITs", ids: ["the-girl-in-my-dream", "clouds-20261109", "on-fragments", "another-horizon"] }
];
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const categoryLabel = (value) => ({ poetry: "POETRY", fiction: "FICTION", fragments: "FRAGMENT" }[value] || "WRITING");
const headers = {
  "content-type": "text/html; charset=utf-8",
  "cache-control": "public, max-age=0, s-maxage=60, must-revalidate",
  "x-content-type-options": "nosniff",
  "referrer-policy": "no-referrer",
  "x-frame-options": "DENY",
  "strict-transport-security": "max-age=31536000; includeSubDomains",
  "content-security-policy": "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; frame-src https://www.googletagmanager.com; form-action 'self'; script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com; upgrade-insecure-requests"
};
export async function onRequestGet({ env }) {
  if (!env.DB) return new Response("The archive is temporarily unavailable.", { status: 503 });
  const { results = [] } = await env.DB.prepare("SELECT id,title,category FROM entries WHERE status='published'").all();
  const byId = new Map(results.map((entry) => [entry.id, entry]));
  const renderedPaths = PATHS.map((path, index) => {
    const entries = path.ids.map((id) => byId.get(id)).filter(Boolean);
    if (entries.length < 2) return "";
    return `<article class="path-card">
      <figure class="path-card-visual">
        <img src="${esc(path.image)}" alt="${esc(path.imageAlt)}" loading="lazy">
      </figure>
      <div class="path-card-heading">
        <span class="path-index">0${index + 1} / READING PATH</span>
        <h2>${esc(path.title)}</h2>
        <p class="path-note">${esc(path.note)}</p>
      </div>
      <div class="path-card-pages">
        <span class="path-count">${entries.length} PIECES</span>
        <ol class="path-list">${entries.map((entry) => `<li><a href="/entry/${encodeURIComponent(entry.id)}"><span>${esc(entry.title)}</span><small>${categoryLabel(entry.category)}</small><b aria-hidden="true">↗</b></a></li>`).join("")}</ol>
      </div>
    </article>`;
  }).filter(Boolean).join("");
  const html = `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#151512">
<meta name="description" content="Follow a few reading paths through The Unquiet Archive. Invitations across poems, fiction and fragments, not genre rules.">
<link rel="canonical" href="${ORIGIN}/paths"><link rel="alternate" type="application/rss+xml" title="The Unquiet Archive — RSS" href="${ORIGIN}/feed.xml">
<title>Reading Paths — The Unquiet Archive</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400;1,6..72,500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/styles.css?v=20261116psych01"><link rel="stylesheet" href="/css/pages.css?v=20261116photo02">
<script async src="https://www.googletagmanager.com/gtag/js?id=G-CX700WJ4RW"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-CX700WJ4RW');</script>
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f)})(window,document,'script','dataLayer','GTM-NNZZZ7MR');</script>
</head><body><noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NNZZZ7MR" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<a class="skip" href="#main">Skip to content</a>
<header class="header"><a class="brand" href="/">ad<span>.</span></a><button class="menu" aria-expanded="false" aria-controls="nav">MENU <b>☰</b></button><nav id="nav"><a href="/archive.html">THE ARCHIVE</a><a href="/paths" aria-current="page">DISCOVER</a><a href="/#manifesto">A NOTE</a><a href="/#about">ABOUT</a><a href="https://discord.com/users/1367853427375214646" target="_blank" rel="noopener noreferrer">CONTACT / DISCORD ↗</a></nav></header>
<main id="main" class="wrap page-shell paths-page">
<div class="page-kicker"><span>THE UNQUIET ARCHIVE</span><span>READ WITHOUT A MAP</span></div>
<div class="page-heading"><p class="micro">READING PATHS</p><h1>Follow a<br><i>thread.</i></h1><p class="page-intro">I put these pieces together because they seem to speak to one another. Read them in order, or don't.</p></div>
<section class="path-grid" aria-label="Curated reading paths">${renderedPaths || '<p class="empty-state">The paths are still taking shape. The full archive is open in the meantime.</p>'}</section>
<section class="chance-panel">
  <figure class="chance-image"><img src="https://images.unsplash.com/photo-1597591406871-b57baac13802?auto=format&fit=crop&w=900&q=80" alt="Dice resting on a wooden table" loading="lazy"></figure>
  <div class="chance-copy"><p class="micro">NO PLAN REQUIRED</p><h2>Leave it to<br><i>chance.</i></h2><p>A random page from anywhere in the archive. See where you land.</p><a class="chance-link" href="/random">PICK A PAGE FOR ME <span>↗</span></a></div>
</section>
</main><footer class="footer wrap"><a class="brand" href="/">ad<span>.</span></a><span>AN ARCHIVE OF WORDS & OTHERWISE</span><a class="rss-link" href="/feed.xml">FOLLOW VIA RSS ↗</a><span>© <b>2026</b> AD</span></footer><script src="/js/main.js?v=20261115editorial" defer></script></body></html>`;
  return new Response(html, { headers });
}
