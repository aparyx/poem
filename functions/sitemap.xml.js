const ORIGIN = "https://aprashanna.com.np";

export async function onRequestGet({ env }) {
  if (!env.DB) return new Response("Sitemap temporarily unavailable.", { status: 503 });
  const { results = [] } = await env.DB.prepare(
    "SELECT id, date, updated_at FROM entries WHERE status='published' ORDER BY date DESC, updated_at DESC"
  ).all();
  const urls = [
    { loc: ORIGIN + "/", changefreq: "weekly", priority: "1.0" },
    { loc: ORIGIN + "/archive.html", changefreq: "weekly", priority: "0.9" },
    { loc: ORIGIN + "/shelf/poetry", changefreq: "weekly", priority: "0.8" },
    { loc: ORIGIN + "/shelf/fragments", changefreq: "weekly", priority: "0.8" },
    { loc: ORIGIN + "/shelf/fiction", changefreq: "weekly", priority: "0.7" },
    ...results.map((entry) => ({
      loc: ORIGIN + "/entry/" + encodeURIComponent(entry.id),
      lastmod: entry.updated_at || entry.date || undefined,
      changefreq: "monthly",
      priority: "0.7"
    }))
  ];
  const xml = '<?xml version="1.0" encoding="UTF-8"?>' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    urls.map((u) => '<url><loc>' + u.loc.replace(/&/g, "&amp;") + '</loc>' +
      (u.lastmod ? '<lastmod>' + String(u.lastmod).slice(0, 10) + '</lastmod>' : '') +
      '<changefreq>' + u.changefreq + '</changefreq><priority>' + u.priority + '</priority></url>').join("") +
    '</urlset>';
  return new Response(xml, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=300, s-maxage=900",
      "x-content-type-options": "nosniff"
    }
  });
}
