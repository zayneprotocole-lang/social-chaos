import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Note: Ensure these environment variables are set in your .env.local file
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
