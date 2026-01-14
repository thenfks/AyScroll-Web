import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://wbsepuoccppuqirtowzg.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_k--ni6qtOBjAjUrTDigxUA_nEMp3eeA";

// Using 'any' for Database type to avoid strict type checking issues
// while allowing flexible table access. Types are enforced via type assertions at call sites.
export const supabase = createClient<any>(SUPABASE_URL, SUPABASE_ANON_KEY);
