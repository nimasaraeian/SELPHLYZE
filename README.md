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
- Each push to `main` auto‑deploys.

### Notes
- Global language is persisted in `localStorage: globalLanguage`.
- Test translation uses `/api/translate`; analysis uses `/api/analyze`.
- On failure, UI falls back to partial local dictionaries.
