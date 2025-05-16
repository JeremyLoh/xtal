import "./Sidebar.css"
import { memo, PropsWithChildren } from "react"
import { Link } from "react-router"
import { AnimatePresence, motion } from "motion/react"
import { IconType } from "react-icons/lib"
import { IoClose } from "react-icons/io5"
import Separator from "../Separator/Separator.tsx"
import Button from "../ui/button/Button.tsx"

const sidebarInitial = { opacity: 0, x: 100 }
const sidebarAnimate = { opacity: 1, x: 0 }
const sidebarExit = { opacity: 0, x: "100%" }
const sidebarTransition = { duration: 0.2, type: "spring", bounce: 0 }

type SidebarProps = PropsWithChildren & {
  open: boolean
  onClose: () => void
  title: string
}

function Sidebar({ open, onClose, title, children }: SidebarProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="sidebar"
          className="sidebar"
          data-testid="sidebar"
          initial={sidebarInitial}
          animate={sidebarAnimate}
          exit={sidebarExit}
          transition={sidebarTransition}
        >
          <motion.div className="sidebar-header">
            <motion.h3
              key="sidebar-title"
              className="sidebar-title"
              data-testid="sidebar-title"
            >
              {title}
            </motion.h3>
            <Button
              keyProp="sidebar-close-button"
              variant="icon"
              data-testid="sidebar-close-button"
              title="Close Sidebar"
              onClick={onClose}
            >
              <IoClose size={28} />
            </Button>
          </motion.div>
          <Separator />
          <motion.div
            key="sidebar-content"
            className="sidebar-content"
            exit={sidebarExit}
            transition={sidebarTransition}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function SidebarMenu({ children }: PropsWithChildren) {
  return <motion.div>{children}</motion.div>
}

type SidebarMenuItemProps = {
  url?: string
  title: string
  "data-testid": string
  Icon: IconType
  onClick?: () => void
}

function SidebarMenuItem({
  url,
  title,
  "data-testid": dataTestId,
  Icon,
  onClick,
}: SidebarMenuItemProps) {
  return (
    <motion.div
      key={`sidebar-menu-item-${title}`}
      className="sidebar-menu-item"
      {...(onClick && { onClick: onClick })}
    >
      {url ? (
        <Link
          to={url}
          className="sidebar-menu-item-link"
          data-testid={dataTestId}
        >
          <Icon size={24} />
          {title}
        </Link>
      ) : (
        <motion.div className="sidebar-menu-item-link" data-testid={dataTestId}>
          <Icon size={24} />
          {title}
        </motion.div>
      )}
    </motion.div>
  )
}

type SidebarGroupProps = { label: string }

function SidebarGroup({
  label,
  children,
}: SidebarGroupProps & PropsWithChildren) {
  // create a section with a label
  return (
    <motion.div className="sidebar-group">
      <motion.div className="sidebar-group-label">{label}</motion.div>
      {children}
    </motion.div>
  )
}

export default memo(Sidebar)
export { SidebarMenu, SidebarMenuItem, SidebarGroup }
