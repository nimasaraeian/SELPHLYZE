-- Enable required extensions
create extension if not exists vector;
create extension if not exists pgcrypto; -- for gen_random_uuid()

-- Documents table
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  namespace text,
  title text,
  text text not null,
  metadata jsonb default '{}',
  created_at timestamp with time zone default now()
);

-- Embeddings table (pgvector)
-- Adjust the dimension (1536) to match your embedding model
create table if not exists public.document_embeddings (
  document_id uuid primary key references public.documents(id) on delete cascade,
  embedding vector(1536) not null
);

-- Vector index (IVFFlat). The table must have data before creating IVFFlat for best performance.
do $$ begin
  begin
    create index document_embeddings_embedding_ivfflat
      on public.document_embeddings
      using ivfflat (embedding vector_l2_ops)
      with (lists = 100);
  exception when duplicate_table then
    null;
  end;
end $$;

-- Similarity search RPC using L2 distance (<->)
-- Returns top K matches, optionally filtered by namespace
create or replace function public.match_documents(
  p_namespace text,
  p_query_embedding vector(1536),
  p_match_count int default 5
)
returns table (
  id uuid,
  namespace text,
  title text,
  text text,
  metadata jsonb,
  distance double precision
) language sql stable as $$
  select d.id,
         d.namespace,
         d.title,
         d.text,
         d.metadata,
         (e.embedding <-> p_query_embedding) as distance
  from public.document_embeddings e
  join public.documents d on d.id = e.document_id
  where (p_namespace is null or d.namespace = p_namespace)
  order by e.embedding <-> p_query_embedding
  limit p_match_count;
$$;

-- Permissions
-- Allow anon (public) to read documents if needed (optional)
-- revoke all on table public.documents from anon;
-- grant select on table public.documents to anon;

-- Allow RPC execution (you can restrict to service_role only if desired)
grant execute on function public.match_documents(text, vector, int) to anon, authenticated, service_role;

-- User profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  bio text,
  location text,
  languages text[] default '{}',
  user_type text check (user_type in ('therapist','client')),
  therapists text[] default '{}',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Test results
create table if not exists public.test_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  test_slug text not null,
  test_name text,
  score numeric,
  payload jsonb not null,
  started_at timestamp with time zone,
  finished_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- Storage (create a bucket named 'avatars' in Supabase dashboard)

-- RLS policies (example permissive policies; adjust for production)
alter table public.profiles enable row level security;
do $$ begin
  create policy "profiles_owner_select" on public.profiles for select using (auth.uid() = id);
  create policy "profiles_owner_upsert" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
exception when duplicate_object then null; end $$;

alter table public.test_results enable row level security;
do $$ begin
  create policy "results_owner_select" on public.test_results for select using (auth.uid() = user_id);
  create policy "results_owner_insert" on public.test_results for insert with check (auth.uid() = user_id);
  create policy "results_owner_delete" on public.test_results for delete using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;




