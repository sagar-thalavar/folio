import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Use dummy placeholder values if variables are missing to prevent initial initialization crash
const activeUrl = supabaseUrl || 'https://placeholder-project-id.supabase.co';
const activeKey = supabaseAnonKey || 'placeholder-anon-public-key';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase environment variables (VITE_SUPABASE_URL and/or VITE_SUPABASE_ANON_KEY) are missing. Please configure them in your local .env file.'
  );
}

export const supabase = createClient(activeUrl, activeKey);
