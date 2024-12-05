import "./Drawer.css"
import { Dispatch, SetStateAction } from "react"
import { MdOutlineHorizontalRule } from "react-icons/md"
import { motion } from "motion/react"

type DrawerProps = {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  children?: React.ReactNode
}

function Drawer(props: DrawerProps) {
  function handleClick() {
    props.setOpen(false)
  }
  return (
    props.open && (
      <motion.div
        className="drawer"
        onClick={handleClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <MdOutlineHorizontalRule size={40} />
        {props?.children}
      </motion.div>
    )
  )
}

export default Drawer
