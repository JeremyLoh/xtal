import "./Sidebar.css"
import { memo, PropsWithChildren } from "react"
import { AnimatePresence, motion } from "motion/react"
import Separator from "../Separator/Separator.tsx"

const sidebarInitial = { opacity: 0, x: 100 }
const sidebarAnimate = { opacity: 1, x: 0 }
const sidebarExit = { opacity: 0, x: "100%" }
const sidebarTransition = { duration: 0.2, type: "spring", bounce: 0 }

type SidebarProps = PropsWithChildren & {
  open: boolean
  title: string
}

function Sidebar({ open, title, children }: SidebarProps) {
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
          <motion.h3 key="sidebar-title" className="sidebar-title">
            {title}
          </motion.h3>
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
