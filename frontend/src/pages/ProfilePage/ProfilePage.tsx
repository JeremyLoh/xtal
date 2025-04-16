import "./ProfilePage.css"
import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router"
import {
  useSessionContext,
  doesSessionExist,
  signOut,
} from "supertokens-auth-react/recipe/session"
import { toast } from "sonner"
import { MdDelete } from "react-icons/md"
import { deleteAccount, getUserEmail } from "../../api/auth/account.ts"
import LoadingDisplay from "../../components/LoadingDisplay/LoadingDisplay.tsx"
import Button from "../../components/ui/button/Button.tsx"
import Separator from "../../components/Separator/Separator.tsx"
import { homePage, profileHistoryPage, resetPasswordPage } from "../../paths.ts"

function ProfilePage() {
  const navigate = useNavigate()
  const session = useSessionContext()
  const [userEmail, setUserEmail] = useState("")
  const [loading, setLoading] = useState(true)

  const navigateToHomepage = useCallback(() => {
    navigate(homePage(), { replace: true })
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
        setLoading(false)
      } else {
        toast.info("Session expired. Please login again")
        signOut().then(() => navigateToHomepage())
      }
    })
  }, [session, navigateToHomepage])

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

  const handleLogoutAccount = useCallback(async () => {
    toast.info("SEE YOU SPACE COWBOY...")
    await signOut()
    navigateToHomepage()
  }, [navigateToHomepage])

  const handleNavigateToProfileHistory = useCallback(() => {
    navigate(profileHistoryPage())
  }, [navigate])

  const handleNavigateToResetPassword = useCallback(() => {
    navigate(resetPasswordPage())
  }, [navigate])

  return (
    <div className="profile-page-container">
      <h2>Profile</h2>
      <Separator />
      <LoadingDisplay loading={loading}>
        <Button onClick={handleLogoutAccount} variant="primary" title="Logout">
          Logout
        </Button>
        <p>
          <b>Email:</b> {userEmail}
        </p>
        <div className="profile-page-account-actions-container">
          <Button
            onClick={handleNavigateToProfileHistory}
            variant="secondary"
            title="Profile History"
          >
            Profile History
          </Button>
          <Button
            onClick={handleNavigateToResetPassword}
            variant="secondary"
            title="Reset Password"
          >
            Reset Password
          </Button>
        </div>
        <Separator />
        <Button
          onClick={handleDeleteAccount}
          className="delete-profile-button"
          variant="danger"
          title="Delete Account"
        >
          <MdDelete size={24} />
          Delete Account
        </Button>
      </LoadingDisplay>
    </div>
  )
}

export default ProfilePage
