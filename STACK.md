# Stack

- Runtime and hosting: Cloudflare Workers
- HTTP and server rendering: Hono + Hono JSX
- Frontend: progressive enhancement with plain browser JavaScript and CSS
- Tooling: Vite+、TypeScript、Oxlint、Oxfmt、Vitest、Wrangler
- Aggregates: Cloudflare D1
- Abuse control: Cloudflare Rate Limiting binding
- Cleanup: Cloudflare Cron Trigger、35日保持

Better Authは使いません。本文は端末内だけで扱い、所有者アカウント、クラウド同期、アクセス制御がないためです。型はTypeScriptの静的データとしてGitでレビューし、UGCや外部AI APIをrequest pathへ追加しません。
