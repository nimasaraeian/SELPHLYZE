SELPHLYZE – Next.js app

### Local Development
1) Install deps and run:
```bash
npm install
npm run dev
```
2) Open http://localhost:3000

### Environment Variables
Create `.env.local` in project root:
```
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
NEXT_PUBLIC_SUPABASE_URL=https://bavznukicjivkchyzzgu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```
Do NOT commit `.env.local` (already ignored).

### Build
```bash
npm run build
npm run start
```

### Deploy (Vercel)
- Connect GitHub repo in Vercel and set Environment Variables (Production + Preview):
  - `OPENAI_API_KEY`
  - `OPENAI_MODEL`
- Each push to `main` auto‑deploys.

### Notes
- Global language is persisted in `localStorage: globalLanguage`.
- Test translation uses `/api/translate`; analysis uses `/api/analyze`.
- On failure, UI falls back to partial local dictionaries.
