import { createClient as createServerClient } from '@/utils/supabase/server'

// For server components: returns a Supabase client (async)
export async function supabase() {
  return await createServerClient()
}