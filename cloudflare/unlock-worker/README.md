# Etto Unlock Worker

Small Cloudflare Worker for supporter-password unlocks.

## Endpoints

- `POST /unlock` with `{ "password": "..." }`
- `POST /verify` with `{ "token": "..." }`

`/unlock` returns a signed token when the password matches. The password and signing key are Cloudflare secrets, not frontend code.

## Deploy

From this folder:

```bash
npx wrangler login
npx wrangler secret put ETTO_SUPPORTER_PASSWORD
npx wrangler secret put ETTO_TOKEN_SECRET
npx wrangler deploy
```

Use a long random value for `ETTO_TOKEN_SECRET`.

For production, set `ETTO_ALLOWED_ORIGIN` in `wrangler.jsonc` to your deployed Etto URL instead of `*`.

## Local Dev

Create `.dev.vars` in this folder:

```dotenv
ETTO_SUPPORTER_PASSWORD="your-local-password"
ETTO_TOKEN_SECRET="a-long-local-signing-secret"
```

Then run:

```bash
npx wrangler dev
```

Do not commit `.dev.vars`.
