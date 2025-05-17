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
import ProfileDeleteForm from "../../features/profile/delete/ProfileDeleteForm/ProfileDeleteForm.tsx"
import LoadingDisplay from "../../components/LoadingDisplay/LoadingDisplay.tsx"
import Button from "../../components/ui/button/Button.tsx"
import Separator from "../../components/Separator/Separator.tsx"
import { homePage, resetPasswordPage } from "../../paths.ts"

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

  const handleDeleteAccount = useCallback(
    async (email: string) => {
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
      if (!session.userId || userEmail === "") {
        return
      }
      if (email !== userEmail) {
        toast.error("Could not delete account. Provided email does not match")
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
    },
    [userEmail, session, navigateToHomepage]
  )

  const handleLogoutAccount = useCallback(async () => {
    setLoading(true)
    await signOut()
    setLoading(false)
    toast.info("SEE YOU SPACE COWBOY...")
    navigateToHomepage()
  }, [navigateToHomepage])

  const handleNavigateToResetPassword = useCallback(() => {
    navigate(resetPasswordPage())
  }, [navigate])

  return (
    <LoadingDisplay loading={loading}>
      <div className="profile-page-container">
        <div>
          <h2>Profile</h2>
          <Separator />
          <p className="profile-page-email">
            <b>Email:</b> {userEmail}
          </p>
        </div>
        <div className="profile-page-account-actions-container">
          <Button
            keyProp="profile-page-reset-password-button"
            onClick={handleNavigateToResetPassword}
            variant="secondary"
            title="Reset Password"
          >
            Reset Password
          </Button>
          <Button
            keyProp="profile-page-logout-button"
            onClick={handleLogoutAccount}
            variant="primary"
            title="Logout"
          >
            Logout
          </Button>
        </div>
        <ProfileDeleteForm onDelete={handleDeleteAccount} />
      </div>
    </LoadingDisplay>
  )
}

export default ProfilePage
