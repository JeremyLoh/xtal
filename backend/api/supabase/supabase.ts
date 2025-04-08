import { createClient } from "@supabase/supabase-js"

const supabaseUrl =
  process.env.SUPABASE_PROJECT_URL || "TODO: MISSING SUPABASE_PROJECT_URL"
const supabaseKey =
  process.env.SUPABASE_PUBLIC_KEY || "TODO: MISSING SUPABASE_PUBLIC_KEY"

const getSupabase = (accessToken: string) => {
  // https://supabase.com/docs/reference/javascript/release-notes#deprecated-setauth
  const supabase = createClient(supabaseUrl, supabaseKey, {
    accessToken: async () => {
      return accessToken
    },
  })
  return supabase
}

export { getSupabase }
