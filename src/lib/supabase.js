import { createClient } from '@supabase/supabase-js';

const viteEnv = typeof import.meta !== 'undefined' ? (import.meta.env || {}) : {};

const supabaseUrl = process.env.VITE_SUPABASE_URL
  || viteEnv.VITE_SUPABASE_URL
  || '';

const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY
  || viteEnv.VITE_SUPABASE_ANON_KEY
  || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
