export async function onRequestGet({ env }) {
  if (!env.DB) return new Response("The archive is temporarily unavailable.", { status: 503 });
  const entry = await env.DB.prepare("SELECT id FROM entries WHERE status='published' ORDER BY RANDOM() LIMIT 1").first();
  if (!entry) return new Response("There are no published pages yet.", { status: 404 });
  return Response.redirect("https://aprashanna.com.np/entry/" + encodeURIComponent(entry.id), 302);
}
