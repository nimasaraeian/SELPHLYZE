# Environment Variables

Create a `.env.local` file in the project root with:

```
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
NEXT_PUBLIC_SUPABASE_URL=https://bavznukicjivkchyzzgu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

In Vercel, set the same variables in Project → Settings → Environment Variables for Production and Preview.


