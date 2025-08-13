Supabase RAG Setup

1) Open Supabase SQL editor and run schema.sql
   - This creates `documents`, `document_embeddings`, the pgvector index, and the RPC `match_documents`
   - Make sure the vector dimension (1536) matches your embedding model

2) Set environment variables (Vercel or .env.local)
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - OPENAI_API_KEY
   - OPENAI_MODEL (optional, default gpt-4o-mini)
   - OPENAI_EMBEDDING_MODEL (optional, default text-embedding-3-small)

3) Ingest content
   POST /api/ingest
   {
     "namespace": "psychology-guides",
     "documents": [
       { "title": "CBT Basics", "text": "Cognitive behavioral therapy helps by..." },
       { "title": "Anxiety Tips", "text": "Breathing techniques and journaling can..." }
     ]
   }

4) Search
   POST /api/rag-search
   {
     "query": "How to handle anxiety?",
     "namespace": "psychology-guides",
     "topK": 3
   }

5) Analyze with context
   POST /api/analyze
   {
     "prompt": "I feel anxious, any advice?",
     "language": "en"
   }












