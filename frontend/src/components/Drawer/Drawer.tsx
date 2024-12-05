import "./Drawer.css"
import { Dispatch, SetStateAction } from "react"
import { MdOutlineHorizontalRule } from "react-icons/md"
import { motion, useDragControls } from "motion/react"

type DrawerProps = {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  children?: React.ReactNode
}

function Drawer(props: DrawerProps) {
  const controls = useDragControls()
  function handleClick() {
    props.setOpen(false)
  }
  function startDrag(event: React.PointerEvent) {
    controls.start(event)
  }
  return (
    props.open && (
      <>
        <motion.div
          className="drawer-background-container"
          onClick={handleClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
        />
        <motion.div
          className="drawer"
          initial={{ x: "5%", y: "50%" }}
          animate={{ x: "5%", y: "0%" }}
          transition={{
            type: "easeInOut",
          }}
          drag="y"
          dragControls={controls}
          dragListener={false} /* Prevent auto drag on pointerdown event */
        >
          <div>
            <button className="drawer-drag-button" onPointerDown={startDrag}>
              <MdOutlineHorizontalRule size={40} />
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
