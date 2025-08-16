# Quick Setup Guide - Environment Variables

## 🚨 Immediate Fix for "OpenAI key is missing" Error

To fix the "OpenAI key is missing" error and enable AI features, follow these steps:

### 1. Create Environment File
Create a file named `.env.local` in your project root (same level as `package.json`)

### 2. Add OpenAI API Key
Add this line to your `.env.local` file:
```bash
OPENAI_API_KEY=sk-your-actual-openai-api-key-here
```

### 3. Get Your OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)
5. Paste it in your `.env.local` file

### 4. Restart Your Development Server
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## 🔧 Complete Environment Setup (Optional)

For full functionality, add these to your `.env.local`:

```bash
# OpenAI (Required for AI features)
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4o-mini
OPENAI_EMBEDDING_MODEL=text-embedding-3-small

# Supabase (Required for database)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# NextAuth (Required for authentication)
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

## ✅ Verification
After setup, you should see:
- AI chat working properly
- No more "OpenAI key is missing" errors
- AI-powered features functioning

## 🆘 Still Having Issues?
- Make sure `.env.local` is in the project root
- Check that the API key starts with `sk-`
- Restart your development server
- Check the browser console for errors



