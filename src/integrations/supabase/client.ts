import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const SUPABASE_URL = "https://wbsepuoccppuqirtowzg.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_k--ni6qtOBjAjUrTDigxUA_nEMp3eeA";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
