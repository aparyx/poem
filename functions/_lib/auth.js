const enc=new TextEncoder();const b64=b=>btoa(String.fromCharCode(...new Uint8Array(b))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");const unb64=s=>Uint8Array.from(atob(s.replace(/-/g,"+").replace(/_/g,"/")+"=".repeat((4-s.length%4)%4)),c=>c.charCodeAt(0));
export function json(data,status=200,headers={}){return new Response(JSON.stringify(data),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store","x-content-type-options":"nosniff",...headers}})}
export function cookie(req,name){for(const p of (req.headers.get("Cookie")||"").split(";")){const [k,...v]=p.trim().split("=");if(k===name)return v.join("=")}return ""}
async function key(secret){return crypto.subtle.importKey("raw",enc.encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign","verify"])}
export async function issueSession(env){const payload=b64(enc.encode(JSON.stringify({exp:Date.now()+28800000})));const sig=b64(await crypto.subtle.sign("HMAC",await key(env.SESSION_SECRET),enc.encode(payload)));return payload+"."+sig}
export async function validSession(req,env){try{const [p,s,...x]=cookie(req,"ad_session").split(".");if(!p||!s||x.length)return false;if(!await crypto.subtle.verify("HMAC",await key(env.SESSION_SECRET),unb64(s),enc.encode(p)))return false;return JSON.parse(new TextDecoder().decode(unb64(p))).exp>Date.now()}catch{return false}}
export function sameOrigin(req){try{return new URL(req.headers.get("Origin")).host===new URL(req.url).host}catch{return false}}
async function digest(s){return new Uint8Array(await crypto.subtle.digest("SHA-256",enc.encode(s)))}
function equal(a,b){if(a.length!==b.length)return false;let d=0;for(let i=0;i<a.length;i++)d|=a[i]^b[i];return d===0}
export async function passwordMatches(input,env){return !!env.ADMIN_PASSWORD&&equal(await digest(input),await digest(env.ADMIN_PASSWORD))}
export async function ipHash(req){return b64(await digest(req.headers.get("CF-Connecting-IP")||"unknown"))}
export async function requireAuth(req,env){if(!env.DB||!env.ADMIN_PASSWORD||!env.SESSION_SECRET)return json({error:"Private library is not configured yet."},503);if(!await validSession(req,env))return json({error:"Please sign in again."},401);return null}
export async function rateLimited(req,env){const row=await env.DB.prepare("SELECT COUNT(*) n FROM login_attempts WHERE ip_hash=? AND attempted_at>?").bind(await ipHash(req),new Date(Date.now()-900000).toISOString()).first();return (row?.n||0)>=8}
export async function recordFailure(req,env){await env.DB.prepare("INSERT INTO login_attempts(ip_hash,attempted_at) VALUES(?,?)").bind(await ipHash(req),new Date().toISOString()).run()}
export async function clearFailures(req,env){await env.DB.prepare("DELETE FROM login_attempts WHERE ip_hash=?").bind(await ipHash(req)).run()}
export const sessionCookie=v=>"ad_session="+v+"; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=28800";