import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('⚠️ Missing Supabase environment variables. Using anon key as fallback.')
}

// Client Supabase pour le serveur (utilise service role key si disponible, sinon anon key)
// Le service role key bypass RLS automatiquement
export const supabaseServer = createClient(
  supabaseUrl || '',
  supabaseServiceKey || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    // S'assurer que le service role key est utilisé (bypass RLS)
    db: {
      schema: 'public'
    }
  }
)

