const encoder = new TextEncoder();

export default {
  async fetch(request, env) {
    const corsHeaders = createCorsHeaders(request, env);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const url = new URL(request.url);
    try {
      if (url.pathname === "/unlock" && request.method === "POST") {
        return await unlock(request, env, corsHeaders);
      }

      if (url.pathname === "/verify" && request.method === "POST") {
        return await verify(request, env, corsHeaders);
      }

      return json({ ok: false, error: "Not found" }, 404, corsHeaders);
    } catch {
      return json({ ok: false, error: "Unlock service error" }, 500, corsHeaders);
    }
  },
};

async function unlock(request, env, corsHeaders) {
  const body = await readJsonBody(request);
  const password = typeof body.password === "string" ? body.password : "";
  const configuredPassword = env.ETTO_SUPPORTER_PASSWORD || "";

  if (!configuredPassword || !(await constantTimeEqual(password, configuredPassword))) {
    return json({ ok: false, error: "Invalid password" }, 401, corsHeaders);
  }

  const now = Math.floor(Date.now() / 1000);
  const ttl = Math.max(60, Number(env.ETTO_TOKEN_TTL_SECONDS) || 2592000);
  const payload = {
    app: "etto",
    scope: "supporter",
    iat: now,
    exp: now + ttl,
  };

  return json({ ok: true, token: await signToken(payload, env), expiresAt: payload.exp }, 200, corsHeaders);
}

async function verify(request, env, corsHeaders) {
  const body = await readJsonBody(request);
  const token = typeof body.token === "string" ? body.token : "";
  const payload = await verifyToken(token, env);

  if (!payload) {
    return json({ ok: false, unlocked: false }, 401, corsHeaders);
  }

  return json({ ok: true, unlocked: true, expiresAt: payload.exp }, 200, corsHeaders);
}

async function signToken(payload, env) {
  const body = base64UrlEncode(JSON.stringify(payload));
  const signature = await hmac(body, env.ETTO_TOKEN_SECRET);
  return `${body}.${signature}`;
}

async function verifyToken(token, env) {
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  const expectedSignature = await hmac(body, env.ETTO_TOKEN_SECRET);
  if (!(await constantTimeEqual(signature, expectedSignature))) return null;

  try {
    const payload = JSON.parse(base64UrlDecode(body));
    const now = Math.floor(Date.now() / 1000);
    if (payload.app !== "etto" || payload.scope !== "supporter" || payload.exp < now) return null;
    return payload;
  } catch {
    return null;
  }
}

async function hmac(value, secret) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return base64UrlEncodeBytes(new Uint8Array(signature));
}

async function constantTimeEqual(a, b) {
  const left = encoder.encode(a);
  const right = encoder.encode(b);
  const length = Math.max(left.length, right.length);
  let diff = left.length ^ right.length;

  for (let i = 0; i < length; i++) {
    diff |= (left[i] || 0) ^ (right[i] || 0);
  }

  await crypto.subtle.digest("SHA-256", encoder.encode(`${a.length}:${b.length}`));
  return diff === 0;
}

async function readJsonBody(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

function createCorsHeaders(request, env) {
  const requestOrigin = request.headers.get("Origin") || "";
  const allowedOrigin = env.ETTO_ALLOWED_ORIGIN || "*";
  const origin = allowedOrigin === "*" ? "*" : requestOrigin === allowedOrigin ? requestOrigin : allowedOrigin;

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function json(data, status, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...extraHeaders,
    },
  });
}

function base64UrlEncode(value) {
  return base64UrlEncodeBytes(encoder.encode(value));
}

function base64UrlEncodeBytes(bytes) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(value) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}
