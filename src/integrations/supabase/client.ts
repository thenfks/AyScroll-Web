import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://wbsepuoccppuqirtowzg.supabase.co";
// Note: You'll need to replace this with your actual Supabase anon key from your project settings
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indic2VwdW9jY3BwdXFpcnRvd3pnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0MjYyMTcsImV4cCI6MjA1MjAwMjIxN30.placeholder";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
