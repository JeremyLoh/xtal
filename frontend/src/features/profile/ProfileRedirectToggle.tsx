import "./ProfileRedirectToggle.css"
import { memo, useCallback } from "react"
import { FaUser } from "react-icons/fa"
import { useNavigate } from "react-router"
import { useSessionContext } from "supertokens-auth-react/recipe/session/index"
import Button from "../../components/ui/button/Button.tsx"

function ProfileRedirectToggle() {
  const session = useSessionContext()
  const navigate = useNavigate()
  const handleClick = useCallback(() => {
    if (session.loading) {
      return
    }
    if (!session.doesSessionExist) {
      navigate("/auth?show=signup")
    } else {
      navigate("/profile")
    }
  }, [session, navigate])
  return (
    <Button
      onClick={handleClick}
      data-testid="profile-redirect-toggle-button"
      className="profile-redirect-toggle-button"
      title="View Profile / Sign in / Sign up"
    >
      <FaUser size={20} />
    </Button>
  )
}

export default memo(ProfileRedirectToggle)
