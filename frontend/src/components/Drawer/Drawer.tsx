import "./Drawer.css"
import { Dispatch, SetStateAction } from "react"
import { MdOutlineHorizontalRule } from "react-icons/md"
import { IoClose } from "react-icons/io5"
import {
  motion,
  useAnimate,
  useDragControls,
  useMotionValue,
} from "motion/react"

type DrawerProps = {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  children?: React.ReactNode
}

function Drawer(props: DrawerProps) {
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
  return (
    props.open && (
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
          initial={{ x: "5%", y: "50%" }}
          animate={{ x: "5%", y: "0%" }}
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
            <button className="drawer-drag-button" onPointerDown={startDrag}>
              <MdOutlineHorizontalRule size={40} />
            </button>
          </div>
          <div className="drawer-info-container">
            <button className="drawer-close-button" onClick={handleClose}>
              <IoClose size={28} />
            </button>
          </div>
          {props.children && (
            <div className="drawer-content">{props.children}</div>
          )}
        </motion.div>
      </>
    )
  )
}

export default Drawer
