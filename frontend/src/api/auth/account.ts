import ky from "ky"
import { getEnv } from "../env/environmentVariables.ts"
import { getSupabase } from "./supabase.ts"

async function deleteAccount(supabaseAccessToken: string, userId: string) {
  const { BACKEND_ORIGIN } = getEnv()
  const backendUrl = BACKEND_ORIGIN + "/api/account"
  const supabase = getSupabase(supabaseAccessToken)
  const { status } = await supabase
    .from("users")
    .delete()
    .eq("user_id", userId)
    .select()
  if (status != 200) {
    throw new Error("Could not delete account. Please try again later")
  }
  try {
    await ky.delete(backendUrl)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(`Could not delete account due to ${error.message}`)
  }
}

async function getUserEmail(
  supabaseAccessToken: string,
  userId: string
): Promise<string | null> {
  const supabase = getSupabase(supabaseAccessToken)
  const { data } = await supabase
    .from("users")
    .select("email")
    .eq("user_id", userId)
  if (data && data.length > 0) {
    return data[0].email
  } else {
    return null
  }
}

export { deleteAccount, getUserEmail }
