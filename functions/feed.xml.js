const SITE = "https://aprashanna.com.np";
const escapeXml = (value = "") => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");

export async function onRequestGet({ env }) {
  if (!env.DB) return new Response("Feed temporarily unavailable.", { status: 503, headers: { "cache-control": "no-store" } });
  const { results = [] } = await env.DB.prepare(
    "SELECT id,title,subtitle,category,date,excerpt FROM entries WHERE status='published' ORDER BY date DESC,updated_at DESC LIMIT 50"
  ).all();
  const items = results.map((entry) => {
    const link = SITE + "/entry/" + encodeURIComponent(entry.id);
    const description = [entry.subtitle, entry.excerpt].filter(Boolean).join("&#10;&#10;");
    const pubDate = entry.date ? new Date(entry.date + "T00:00:00Z").toUTCString() : "";
    return `<item><title>${escapeXml(entry.title)}</title><link>${escapeXml(link)}</link><guid isPermaLink="true">${escapeXml(link)}</guid>${pubDate ? `<pubDate>${pubDate}</pubDate>` : ""}<description>${escapeXml(description)}</description>${entry.category ? `<category>${escapeXml(entry.category)}</category>` : ""}</item>`;
  }).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>Aprashanna</title><link>${SITE}</link><description>Poetry, fragments and writing from Aprashanna.</description><language>en</language><lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}</channel></rss>`;
  return new Response(xml, { status: 200, headers: { "content-type": "application/rss+xml; charset=utf-8", "cache-control": "public, max-age=300, s-maxage=900", "x-content-type-options": "nosniff" } });
}
