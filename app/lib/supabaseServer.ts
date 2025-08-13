import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string | undefined;

if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set');
}

// Service role key is required for server-side writes during ingestion
export const supabaseServer = createClient(
  supabaseUrl,
  supabaseServiceRoleKey || ''
);












