import "./SidebarToggle.css"
import { useState } from "react"
import { LuAlignJustify, LuPodcast, LuRadioTower } from "react-icons/lu"
import useClickOutside from "../../hooks/useClickOutside.ts"
import Button from "../ui/button/Button.tsx"
import Sidebar, { SidebarMenu, SidebarMenuItem } from "../Sidebar/Sidebar.tsx"
import { homePage, podcastHomePage } from "../../paths.ts"

const homePageUrl = homePage()
const podcastHomePageUrl = podcastHomePage()

function SidebarToggle() {
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
        </SidebarMenu>
      </Sidebar>
    </div>
  )
}

export default SidebarToggle
