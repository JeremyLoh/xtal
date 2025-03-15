import "./Drawer.css"
import { useRef } from "react"
import { createPortal } from "react-dom"
import { MdOutlineHorizontalRule } from "react-icons/md"
import { IoClose } from "react-icons/io5"
import {
  motion,
  useAnimate,
  useDragControls,
  useMotionValue,
} from "motion/react"
import Button from "../ui/button/Button.tsx"

type DrawerProps = {
  open: boolean
  setOpen: (isOpen: boolean) => void
  title: string
  children?: React.ReactNode
}

function Drawer(props: DrawerProps) {
  const drawerRootRef = useRef<HTMLElement>(
    document.getElementById("drawer-root")
  )
  const y = useMotionValue(0)
  const [scope, animate] = useAnimate()
  const controls = useDragControls()
  async function handleClose() {
    const yStart = typeof y.get() === "number" ? y.get() : 0
    await animate(scope.current, { y: [yStart, "100%"] })
    props.setOpen(false)
  }
  function startDrag(event: React.PointerEvent) {
    controls.start(event)
  }
  function onDragEnd() {
    const isDragDownGreaterThanThreshold = y.get() > 100
    if (isDragDownGreaterThanThreshold) {
      handleClose()
    }
  }

  if (drawerRootRef.current == null) {
    return null
  }
  return (
    props.open &&
    createPortal(
      <>
        <motion.div
          className="drawer-background-container"
          onClick={handleClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
        />
        <motion.div
          className="drawer"
          ref={scope}
          initial={{ x: "0%", y: "50%" }}
          animate={{ x: "0%", y: "0%" }}
          transition={{
            type: "easeInOut",
          }}
          style={{ y }}
          drag="y"
          onDragEnd={onDragEnd}
          dragControls={controls}
          dragListener={false} /* Prevent auto drag on pointerdown event */
          dragConstraints={{
            top: 0,
            bottom: 0,
          }}
          dragElastic={{
            top: 0,
            bottom: 0.4,
          }}
        >
          <div>
            <Button className="drawer-drag-button" onPointerDown={startDrag}>
              <MdOutlineHorizontalRule size={40} />
            </Button>
          </div>
          <div className="drawer-info-container">
            <h3 className="drawer-title">{props.title}</h3>
            <Button className="drawer-close-button" onClick={handleClose}>
              <IoClose size={28} />
            </Button>
          </div>
          {props.children && (
            <div className="drawer-content">{props.children}</div>
          )}
        </motion.div>
      </>,
      drawerRootRef.current
    )
  )
}

export default Drawer
