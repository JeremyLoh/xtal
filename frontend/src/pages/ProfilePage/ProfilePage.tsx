import "./ProfilePage.css"
import { useEffect, useState } from "react"
import { useSessionContext } from "supertokens-auth-react/recipe/session"
import { getSupabase } from "../../api/auth/supabase.ts"
import LoadingDisplay from "../../components/LoadingDisplay/LoadingDisplay.tsx"

function ProfilePage() {
  const session = useSessionContext()
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    document.title = "xtal - profile"
  }, [])

  useEffect(() => {
    async function getUserEmail() {
      if (session.loading) {
        return
      }
      if (!session.userId) {
        return
      }
      const supabase = getSupabase(session.accessTokenPayload.supabase_token)
      const { data } = await supabase
        .from("users")
        .select("email")
        .eq("user_id", session.userId)
      if (data && data.length > 0) {
        setUserEmail(data[0].email)
      }
    }

    getUserEmail()
  }, [session])

  return (
    <LoadingDisplay loading={session ? session.loading : true}>
      <div className="profile-page-container">
        <h2>Profile</h2>
        <p>
          <b>Email:</b> {userEmail}
        </p>
      </div>
    </LoadingDisplay>
  )
}

export default ProfilePage
