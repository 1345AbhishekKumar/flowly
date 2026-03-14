import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('Supabase URL or Service Role Key missing. Database operations will fail.');
}

// Ensure you use the Service Role Key ONLY on the server-side
// This bypasses Row Level Security (RLS) policies completely.
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
