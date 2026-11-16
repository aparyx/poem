const ORIGIN = "https://aprashanna.com.np";
const xml = (value) => String(value ?? "").replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c]));
export async function onRequestGet({ env }) {
  if (!env.DB) return new Response("Feed temporarily unavailable.", { status: 503 });
  const { results = [] } = await env.DB.prepare("SELECT id,title,subtitle,category,date,excerpt,updated_at FROM entries WHERE status='published' ORDER BY date DESC, updated_at DESC LIMIT 50").all();
  const items = results.map((entry) => {
    const link = ORIGIN + "/entry/" + encodeURIComponent(entry.id);
    const summary = entry.excerpt || entry.subtitle || "A new page from The Unquiet Archive.";
    const date = entry.date ? new Date(entry.date + "T00:00:00Z").toUTCString() : "";
    return "<item><title>" + xml(entry.title) + "</title><link>" + link + "</link><guid isPermaLink=\"true\">" + link + "</guid><description>" + xml(summary) + "</description>" +
      (entry.category ? "<category>" + xml(entry.category) + "</category>" : "") +
      (date ? "<pubDate>" + date + "</pubDate>" : "") + "</item>";
  }).join("");
  const body = '<?xml version="1.0" encoding="UTF-8"?>' + '<rss version="2.0"><channel><title>The Unquiet Archive</title><link>' + ORIGIN + '</link><description>Poems, stories and fragments from Ad.</description><language>en</language><lastBuildDate>' + new Date().toUTCString() + '</lastBuildDate>' + items + '</channel></rss>';
  return new Response(body, { headers: { "content-type":"application/rss+xml; charset=utf-8", "cache-control":"public, max-age=300, s-maxage=900", "x-content-type-options":"nosniff" } });
}
