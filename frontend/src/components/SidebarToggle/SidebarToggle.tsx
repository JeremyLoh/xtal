import "./SidebarToggle.css"
import { useState } from "react"
import { LuAlignJustify } from "react-icons/lu"
import Button from "../ui/button/Button.tsx"
import Sidebar from "../Sidebar/Sidebar.tsx"

function SidebarToggle() {
  const [open, setOpen] = useState<boolean>(false)

  function handleToggle() {
    setOpen(!open)
  }

  return (
    <>
      <Button
        keyProp="sidebar-toggle-button"
        data-testid="sidebar-toggle-button"
        className="sidebar-toggle-button"
        title="Toggle Sidebar"
        onClick={handleToggle}
      >
        <LuAlignJustify size={20} />
      </Button>
      <Sidebar title="Actions" open={open} onClose={handleToggle}></Sidebar>
    </>
  )
}

export default SidebarToggle
