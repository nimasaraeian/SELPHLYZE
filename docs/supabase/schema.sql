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
  username text unique,
  public boolean default false,
  tagline text,
  links jsonb default '{}',
  timezone text,
  primary_focus text,
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

-- A/B testing events
create table if not exists public.ab_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  experiment text not null,
  variant text check (variant in ('A','B')) not null,
  event_type text check (event_type in ('assign','view','click')) not null,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

alter table public.ab_events enable row level security;
do $$ begin
  create policy "ab_owner_insert" on public.ab_events for insert with check (true);
  create policy "ab_owner_select" on public.ab_events for select using (true);
exception when duplicate_object then null; end $$;

-- Feedback table
create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  context text, -- e.g., 'test:general-personality' or 'feature:search'
  rating int check (rating between 1 and 5) not null,
  comment text,
  created_at timestamptz default now()
);

alter table public.feedback enable row level security;
do $$ begin
  create policy "feedback_insert" on public.feedback for insert with check (true);
  create policy "feedback_select" on public.feedback for select using (true);
exception when duplicate_object then null; end $$;

-- Activity log (books purchased, podcasts listened, articles read)
create table if not exists public.user_activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  category text check (category in ('book','podcast','article')) not null,
  title text,
  date timestamp with time zone,
  payload jsonb default '{}',
  created_at timestamp with time zone default now()
);

alter table public.user_activity enable row level security;
do $$ begin
  create policy "activity_owner_select" on public.user_activity for select using (auth.uid() = user_id);
  create policy "activity_owner_insert" on public.user_activity for insert with check (auth.uid() = user_id);
  create policy "activity_owner_delete" on public.user_activity for delete using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

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

-- Modules and progress
create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  steps int default 10,
  cover_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.module_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  module_id uuid references public.modules(id) on delete cascade,
  current_step int default 0,
  percent int default 0,
  updated_at timestamptz default now(),
  unique(user_id, module_id)
);

alter table public.module_progress enable row level security;
do $$ begin
  create policy "mp_owner_select" on public.module_progress for select using (auth.uid() = user_id);
  create policy "mp_owner_upsert" on public.module_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

-- Content library
create type content_type as enum ('BOOK','PODCAST','ARTICLE');
create type user_content_status as enum ('TO_READ','IN_PROGRESS','DONE');

do $$ begin
  perform 1 from pg_type where typname = 'content_type';
exception when undefined_object then null; end $$;

create table if not exists public.content (
  id uuid primary key default gen_random_uuid(),
  type content_type not null,
  title text not null,
  author text,
  url text,
  cover_url text,
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.user_content (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  content_id uuid references public.content(id) on delete cascade,
  status user_content_status default 'TO_READ',
  progress int default 0,
  rating int,
  notes jsonb,
  saved_at timestamptz default now(),
  completed_at timestamptz,
  unique(user_id, content_id)
);

alter table public.user_content enable row level security;
do $$ begin
  create policy "uc_owner_all" on public.user_content for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

-- Activity feed
create type activity_type as enum ('TEST_COMPLETED','MODULE_UPDATED','CONTENT_ADDED','CONTENT_COMPLETED','FEEDBACK_GIVEN');
do $$ begin
  perform 1 from pg_type where typname = 'activity_type';
exception when undefined_object then null; end $$;

create table if not exists public.activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  type activity_type not null,
  ref_id text,
  payload jsonb,
  created_at timestamptz default now()
);

alter table public.activity enable row level security;
do $$ begin
  create policy "activity_owner_select" on public.activity for select using (auth.uid() = user_id);
  create policy "activity_owner_insert" on public.activity for insert with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;




