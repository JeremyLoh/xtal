import { createClient } from "@supabase/supabase-js"
import { getEnv } from "../env/environmentVariables.ts"

const { SUPABASE_PROJECT_URL, SUPABASE_PUBLIC_KEY } = getEnv()

const getSupabase = (accessToken: string) => {
  // https://supabase.com/docs/reference/javascript/release-notes#deprecated-setauth
  // https://github.com/supabase/auth-js/pull/340#issuecomment-1218065610
  const supabase = createClient(SUPABASE_PROJECT_URL, SUPABASE_PUBLIC_KEY, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  })
  return supabase
}

export { getSupabase }
