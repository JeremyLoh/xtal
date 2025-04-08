import "./ProfilePage.css"
import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router"
import {
  useSessionContext,
  doesSessionExist,
  signOut,
} from "supertokens-auth-react/recipe/session"
import { toast } from "sonner"
import { deleteAccount, getUserEmail } from "../../api/auth/account.ts"
import LoadingDisplay from "../../components/LoadingDisplay/LoadingDisplay.tsx"
import Button from "../../components/ui/button/Button.tsx"

function ProfilePage() {
  const session = useSessionContext()
  const navigate = useNavigate()
  const [userEmail, setUserEmail] = useState("")
  const [loading, setLoading] = useState(true)

  const navigateToHomepage = useCallback(() => {
    navigate("/", { replace: true })
  }, [navigate])

  useEffect(() => {
    document.title = "xtal - profile"
  }, [])

  useEffect(() => {
    if (session.loading) {
      return
    }
    if (!session.userId) {
      return
    }
    setLoading(true)
    getUserEmail(
      session.accessTokenPayload.supabase_token,
      session.userId
    ).then((email) => {
      if (email) {
        setUserEmail(email)
      }
      setLoading(false)
    })
  }, [session])

  const handleDeleteAccount = useCallback(async () => {
    if (session.loading) {
      return
    }
    const sessionExists = await doesSessionExist()
    if (!sessionExists) {
      toast.info("Session expired. Please login again")
      await signOut()
      navigateToHomepage()
      return
    }
    if (!session.userId) {
      return
    }
    try {
      setLoading(true)
      await deleteAccount(
        session.accessTokenPayload.supabase_token,
        session.userId
      )
      toast.success("Account deleted")
      navigateToHomepage()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }, [session, navigateToHomepage])

  return (
    <div className="profile-page-container">
      <h2>Profile</h2>
      <LoadingDisplay loading={loading}>
        <p>
          <b>Email:</b> {userEmail}
        </p>
        <Button
          onClick={handleDeleteAccount}
          className="delete-profile-button"
          variant="danger"
          title="Delete Account"
        >
          Delete Account
        </Button>
      </LoadingDisplay>
    </div>
  )
}

export default ProfilePage
