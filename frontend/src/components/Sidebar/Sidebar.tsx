import "./Sidebar.css"
import { memo, PropsWithChildren } from "react"
import { AnimatePresence, motion } from "motion/react"
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
              <IoClose size={20} />
            </Button>
          </motion.div>
          <Separator />
          <motion.div
            key="sidebar-content"
            className="sidebar-content"
            exit={sidebarExit}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default memo(Sidebar)
