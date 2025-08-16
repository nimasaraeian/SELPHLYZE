SELPHLYZE – Next.js app

### Local Development
1) Install deps and run:
```bash
npm install
npm run dev
```
2) Open http://localhost:3000

### Environment Variables
Create `.env.local` in project root with the following variables:

```bash
# OpenAI Configuration (Required for AI features)
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_MODEL=gpt-4o-mini
OPENAI_EMBEDDING_MODEL=text-embedding-3-small

# Supabase Configuration (Required for database)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# NextAuth Configuration (Required for authentication)
NEXTAUTH_SECRET=your-secret-key-here-change-this
NEXTAUTH_URL=http://localhost:3000

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
```

**Important Notes:**
- Do NOT commit `.env.local` (already ignored by .gitignore)
- Get your OpenAI API key from: https://platform.openai.com/api-keys
- Get your Supabase credentials from your Supabase project dashboard
- Without `OPENAI_API_KEY`, AI features will not work and you'll see "OpenAI key is missing" errors

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
