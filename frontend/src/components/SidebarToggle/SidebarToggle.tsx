import "./SidebarToggle.css"
import { createPortal } from "react-dom"
import { memo, ReactPortal, useState } from "react"
import { LuAlignJustify, LuPodcast, LuRadioTower } from "react-icons/lu"
import { GoStarFill } from "react-icons/go"
import useClickOutside from "../../hooks/useClickOutside.ts"
import Button from "../ui/button/Button.tsx"
import FavouriteStationToggle from "../../features/favourite/FavouriteStationToggle/FavouriteStationToggle.tsx"
import Sidebar, {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
} from "../Sidebar/Sidebar.tsx"
import ProfileSidebarGroup from "../../features/sidebar/ProfileSidebarGroup.tsx"
import { homePage, podcastHomePage } from "../../paths.ts"

const homePageUrl = homePage()
const podcastHomePageUrl = podcastHomePage()

function SidebarToggle() {
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
                onClick={handleToggle}
                data-testid="sidebar-menu-item-radio"
              />
              <SidebarMenuItem
                title="Podcasts"
                url={podcastHomePageUrl}
                Icon={LuPodcast}
                onClick={handleToggle}
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
            <ProfileSidebarGroup setOpen={setOpen} />
          </SidebarMenu>
        </Sidebar>
      </div>
      {portals && portals.map((p) => p)}
    </>
  )
}

export default memo(SidebarToggle)
