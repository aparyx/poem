const ORIGIN = "https://aprashanna.com.np";
const LABELS = { poetry: "Poetry", fiction: "Fiction", fragments: "Fragments" };
const DESCRIPTIONS = {
  poetry: "Original poems on love, loneliness, memory, humanity, grief, and the difficult business of being alive.",
  fiction: "Original short fiction, mysteries, and imagined lives from The Unquiet Archive.",
  fragments: "Short reflections, observations, and unfinished thoughts on existence, belief, beauty, and ordinary life."
};
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[c]));
export async function onRequestGet({ params, env }) {
  const category = String(params.category || "");
  if (!LABELS[category]) return new Response("Not found.", { status: 404 });
  if (!env.DB) return new Response("Archive temporarily unavailable.", { status: 503 });
  const { results = [] } = await env.DB.prepare(
    "SELECT id,title,subtitle,excerpt,date FROM entries WHERE status='published' AND category=? ORDER BY date DESC,updated_at DESC"
  ).bind(category).all();
  const list = results.map((e) => `<a class="entry-card" href="/entry/${encodeURIComponent(e.id)}"><span class="entry-meta">${esc((e.date || "").toUpperCase())}</span><span><h2>${esc(e.title)}</h2><p>${esc(e.excerpt || e.subtitle || "")}</p></span><span class="entry-arrow">↗</span></a>`).join("");
  const title = LABELS[category];
  const url = ORIGIN + "/shelf/" + category;
  const description = DESCRIPTIONS[category];
  const html = `<!doctype html><html lang="en"><head>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-CX700WJ4RW"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-CX700WJ4RW');
</script>
<!-- End Google tag -->
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NNZZZ7MR');</script>
<!-- End Google Tag Manager --><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#151512"><meta name="description" content="${esc(description)}"><link rel="canonical" href="${url}">
<meta property="og:type" content="website"><meta property="og:site_name" content="The Unquiet Archive"><meta property="og:title" content="${title} — The Unquiet Archive"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${url}">
<title>${title} — The Unquiet Archive</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/styles.css?v=20261101content"><link rel="stylesheet" href="/css/pages.css?v=20261101content"></head>
<body>
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NNZZZ7MR"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) --><a class="skip" href="#main">Skip to content</a><header class="header"><a class="brand" href="/">ad<span>.</span></a><button class="menu" aria-expanded="false" aria-controls="nav">MENU <b>☰</b></button><nav id="nav"><a href="/archive.html">THE ARCHIVE</a><a href="/#manifesto">A NOTE</a><a href="/#about">ABOUT</a></nav></header>
<main id="main" class="wrap page-shell"><div class="page-kicker"><span>THE UNQUIET ARCHIVE</span><span>THE COLLECTION</span></div><div class="page-heading"><p class="micro">THE SHELVES</p><h1>${title}<br><i>in the archive.</i></h1><p class="page-intro">${esc(description)}</p></div><section class="entry-list">${list || '<p class="page-intro">This shelf is quiet for now.</p>'}</section><p class="micro">${results.length} PUBLISHED WORKS</p><a class="text-link" href="/archive.html">EXPLORE THE COMPLETE ARCHIVE ↗</a></main>
<footer class="footer wrap"><a class="brand" href="/">ad<span>.</span></a><span>AN ARCHIVE OF WORDS & OTHERWISE</span><span>© <b>2026</b> AD</span></footer><script src="/js/main.js?v=20261101content" defer></script></body></html>`;
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=60, s-maxage=300", "x-content-type-options": "nosniff", "referrer-policy": "no-referrer", "x-frame-options": "DENY", "strict-transport-security": "max-age=31536000; includeSubDomains", "content-security-policy": "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; frame-src https://www.googletagmanager.com; form-action 'self'; script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com; upgrade-insecure-requests" } });
}
