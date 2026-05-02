import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://apibkrxnduyusquzkqam.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwaWJrcnhuZHV5dXNxdXprcWFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NDk2NTEsImV4cCI6MjA5MzIyNTY1MX0.GhDvL-GOPgmZ_L_6mpQtRHivYoGGaD9I1JbFjeQqaKA';

let supabaseClient = null;
try {
  let finalUrl = supabaseUrl;
  
  if (finalUrl && !finalUrl.startsWith('http')) {
    // Attempt to extract from JWT if they pasted wrong URL
    try {
      const payload = JSON.parse(atob(supabaseAnonKey.split('.')[1]));
      if (payload.ref) {
        finalUrl = `https://${payload.ref}.supabase.co`;
      }
    } catch(e) {}
  }

  if (finalUrl && supabaseAnonKey && finalUrl.startsWith('http')) {
    supabaseClient = createClient(finalUrl, supabaseAnonKey);
  }
} catch (e) {
  console.error("Failed to initialize Supabase client", e);
}

export const supabase = supabaseClient;
