import { memo } from "react"
import { toast } from "sonner"
import {
  signOut,
  useSessionContext,
} from "supertokens-auth-react/recipe/session/index"
import {
  LuHistory,
  LuLogOut,
  LuRedo2,
  LuUser,
  LuUserPlus,
} from "react-icons/lu"
import { MdFollowTheSigns } from "react-icons/md"
import {
  SidebarGroup,
  SidebarMenuItem,
} from "../../components/Sidebar/Sidebar.tsx"
import {
  profileFollowingPage,
  profileHistoryPage,
  profilePage,
  resetPasswordPage,
  signInPage,
  signUpPage,
} from "../../paths.ts"

const profileSignInPageUrl = signInPage()
const profileSignUpPageUrl = signUpPage()
const profilePageUrl = profilePage()
const profileFollowingPageUrl = profileFollowingPage()
const profileListenHistoryPageUrl = profileHistoryPage()
const profileResetPasswordPageUrl = resetPasswordPage()

type ProfileSidebarGroupProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function ProfileSidebarGroup({ setOpen }: Readonly<ProfileSidebarGroupProps>) {
  const session = useSessionContext()

  function handleToggle() {
    setOpen(false)
  }

  async function handleLogout() {
    await signOut()
    setOpen(false)
    toast.info("SEE YOU SPACE COWBOY...")
  }

  return (
    <SidebarGroup label="Profile">
      {session.loading || !session.doesSessionExist ? (
        <>
          <SidebarMenuItem
            title="Sign In"
            url={profileSignInPageUrl}
            Icon={LuUser}
            onClick={handleToggle}
            data-testid="sidebar-menu-item-profile-sign-in"
          />
          <SidebarMenuItem
            title="Sign Up"
            url={profileSignUpPageUrl}
            Icon={LuUserPlus}
            onClick={handleToggle}
            data-testid="sidebar-menu-item-profile-sign-up"
          />
        </>
      ) : (
        <>
          <SidebarMenuItem
            title="Your Profile"
            url={profilePageUrl}
            Icon={LuUser}
            onClick={handleToggle}
            data-testid="sidebar-menu-item-profile"
          />
          <SidebarMenuItem
            title="Following"
            url={profileFollowingPageUrl}
            Icon={MdFollowTheSigns}
            onClick={handleToggle}
            data-testid="sidebar-menu-item-profile-following"
          />
          <SidebarMenuItem
            title="Listen History"
            url={profileListenHistoryPageUrl}
            Icon={LuHistory}
            onClick={handleToggle}
            data-testid="sidebar-menu-item-profile-listen-history"
          />
          <SidebarMenuItem
            title="Reset Password"
            url={profileResetPasswordPageUrl}
            Icon={LuRedo2}
            onClick={handleToggle}
            data-testid="sidebar-menu-item-profile-reset-password"
          />
          <SidebarMenuItem
            title="Logout"
            Icon={LuLogOut}
            onClick={handleLogout}
            data-testid="sidebar-menu-item-profile-logout"
          />
        </>
      )}
    </SidebarGroup>
  )
}

export default memo(ProfileSidebarGroup)
