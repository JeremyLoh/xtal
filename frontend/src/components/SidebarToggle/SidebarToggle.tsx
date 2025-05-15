import "./SidebarToggle.css"
import { memo, useState } from "react"
import { toast } from "sonner"
import {
  LuAlignJustify,
  LuHistory,
  LuLogOut,
  LuPodcast,
  LuRadioTower,
  LuUser,
  LuUserPlus,
} from "react-icons/lu"
import { MdFollowTheSigns } from "react-icons/md"
import {
  signOut,
  useSessionContext,
} from "supertokens-auth-react/recipe/session/index"
import useClickOutside from "../../hooks/useClickOutside.ts"
import Button from "../ui/button/Button.tsx"
import Sidebar, {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
} from "../Sidebar/Sidebar.tsx"
import {
  homePage,
  podcastHomePage,
  profileFollowingPage,
  profileHistoryPage,
  signInPage,
  signUpPage,
} from "../../paths.ts"

const homePageUrl = homePage()
const podcastHomePageUrl = podcastHomePage()
const profileSignInPageUrl = signInPage()
const profileSignUpPageUrl = signUpPage()
const profileFollowingPageUrl = profileFollowingPage()
const profileListenHistoryPageUrl = profileHistoryPage()

function SidebarToggle() {
  const session = useSessionContext()
  const [open, setOpen] = useState<boolean>(false)
  const clickOutsideRef = useClickOutside<HTMLDivElement>({
    onClickOutside: handleClickOutside,
  })
  function handleToggle() {
    setOpen(!open)
  }
  function handleClickOutside() {
    if (!open) {
      return
    }
    setOpen(false)
  }
  async function handleLogout() {
    await signOut()
    setOpen(false)
    toast.info("SEE YOU SPACE COWBOY...")
  }

  return (
    <div ref={clickOutsideRef}>
      <Button
        keyProp="sidebar-toggle-button"
        data-testid="sidebar-toggle-button"
        className="sidebar-toggle-button"
        title="Toggle Sidebar"
        onClick={handleToggle}
      >
        <LuAlignJustify size={20} />
      </Button>
      <Sidebar title="Actions" open={open} onClose={handleToggle}>
        <SidebarMenu>
          <SidebarGroup label="Home">
            <SidebarMenuItem
              title="Radio"
              url={homePageUrl}
              Icon={LuRadioTower}
            />
            <SidebarMenuItem
              title="Podcasts"
              url={podcastHomePageUrl}
              Icon={LuPodcast}
            />
          </SidebarGroup>
          <SidebarGroup label="Profile">
            {!session.loading && !session.doesSessionExist ? (
              <>
                <SidebarMenuItem
                  title="Sign In"
                  url={profileSignInPageUrl}
                  Icon={LuUser}
                />
                <SidebarMenuItem
                  title="Sign Up"
                  url={profileSignUpPageUrl}
                  Icon={LuUserPlus}
                />
              </>
            ) : (
              <>
                <SidebarMenuItem
                  title="Following"
                  url={profileFollowingPageUrl}
                  Icon={MdFollowTheSigns}
                />
                <SidebarMenuItem
                  title="Listen History"
                  url={profileListenHistoryPageUrl}
                  Icon={LuHistory}
                />
                <SidebarMenuItem
                  title="Logout"
                  Icon={LuLogOut}
                  onClick={handleLogout}
                />
              </>
            )}
          </SidebarGroup>
        </SidebarMenu>
      </Sidebar>
    </div>
  )
}

export default memo(SidebarToggle)
