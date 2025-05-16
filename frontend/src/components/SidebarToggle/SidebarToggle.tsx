import "./SidebarToggle.css"
import { createPortal } from "react-dom"
import { memo, ReactPortal, useState } from "react"
import { toast } from "sonner"
import {
  LuAlignJustify,
  LuHistory,
  LuLogOut,
  LuPodcast,
  LuRadioTower,
  LuRedo2,
  LuUser,
  LuUserPlus,
} from "react-icons/lu"
import { MdFollowTheSigns } from "react-icons/md"
import { GoStarFill } from "react-icons/go"
import {
  signOut,
  useSessionContext,
} from "supertokens-auth-react/recipe/session/index"
import useClickOutside from "../../hooks/useClickOutside.ts"
import Button from "../ui/button/Button.tsx"
import FavouriteStationToggle from "../../features/favourite/FavouriteStationToggle/FavouriteStationToggle.tsx"
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
  profilePage,
  resetPasswordPage,
  signInPage,
  signUpPage,
} from "../../paths.ts"

const homePageUrl = homePage()
const podcastHomePageUrl = podcastHomePage()
const profileSignInPageUrl = signInPage()
const profileSignUpPageUrl = signUpPage()
const profilePageUrl = profilePage()
const profileFollowingPageUrl = profileFollowingPage()
const profileListenHistoryPageUrl = profileHistoryPage()
const profileResetPasswordPageUrl = resetPasswordPage()

function SidebarToggle() {
  const session = useSessionContext()
  const [open, setOpen] = useState<boolean>(false)
  const [portals, setPortals] = useState<ReactPortal[] | []>([])
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
  function handleFavouriteStationClick() {
    setOpen(false)
    setPortals([
      ...portals,
      createPortal(<FavouriteStationToggle isOpen={true} />, document.body),
    ])
  }

  return (
    <>
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
                data-testid="sidebar-menu-item-radio"
              />
              <SidebarMenuItem
                title="Podcasts"
                url={podcastHomePageUrl}
                Icon={LuPodcast}
                data-testid="sidebar-menu-item-podcasts"
              />
            </SidebarGroup>
            <SidebarGroup label="Radio">
              <SidebarMenuItem
                title="View Favourite Stations"
                Icon={GoStarFill}
                onClick={handleFavouriteStationClick}
                data-testid="sidebar-menu-item-radio-view-favourite-stations"
              />
            </SidebarGroup>
            <SidebarGroup label="Profile">
              {session.loading || !session.doesSessionExist ? (
                <>
                  <SidebarMenuItem
                    title="Sign In"
                    url={profileSignInPageUrl}
                    Icon={LuUser}
                    data-testid="sidebar-menu-item-profile-sign-in"
                  />
                  <SidebarMenuItem
                    title="Sign Up"
                    url={profileSignUpPageUrl}
                    Icon={LuUserPlus}
                    data-testid="sidebar-menu-item-profile-sign-up"
                  />
                </>
              ) : (
                <>
                  <SidebarMenuItem
                    title="Your Profile"
                    url={profilePageUrl}
                    Icon={LuUser}
                    data-testid="sidebar-menu-item-profile"
                  />
                  <SidebarMenuItem
                    title="Following"
                    url={profileFollowingPageUrl}
                    Icon={MdFollowTheSigns}
                    data-testid="sidebar-menu-item-profile-following"
                  />
                  <SidebarMenuItem
                    title="Listen History"
                    url={profileListenHistoryPageUrl}
                    Icon={LuHistory}
                    data-testid="sidebar-menu-item-profile-listen-history"
                  />
                  <SidebarMenuItem
                    title="Reset Password"
                    url={profileResetPasswordPageUrl}
                    Icon={LuRedo2}
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
          </SidebarMenu>
        </Sidebar>
      </div>
      {portals && portals.map((p) => p)}
    </>
  )
}

export default memo(SidebarToggle)
