import "./Dialog.css"
import { PropsWithChildren } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "motion/react"
import { IoClose } from "react-icons/io5"
import Button from "../ui/button/Button.tsx"
import Separator from "../Separator/Separator.tsx"

const dialogInitial = { opacity: 0, y: "100%" }
const dialogAnimate = { opacity: 1, y: 0 }
const dialogExit = { opacity: 0, y: "100%" }
const dialogTransition = { duration: 0.2, type: "spring", bounce: 0 }

type DialogProps = {
  title: string
  open: boolean
  onClose: () => void
  className?: string
} & PropsWithChildren

function Dialog({ title, open, onClose, className, children }: DialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="dialog-container">
          <DialogDimBackground onClose={onClose} />
          <motion.div
            className={`dialog ${className ? className : ""}`}
            initial={dialogInitial}
            animate={dialogAnimate}
            exit={dialogExit}
            transition={dialogTransition}
          >
            <motion.div className="dialog-header">
              <motion.h3>{title}</motion.h3>
              <Button
                keyProp="dialog-close-button"
                className="dialog-close-button"
                variant="icon"
                title="Close Dialog"
                onClick={onClose}
              >
                <IoClose size={24} />
              </Button>
            </motion.div>
            <Separator />
            <motion.div>{children}</motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

type DialogContentProps = {
  "data-testid": string
} & PropsWithChildren

function DialogContent({
  "data-testid": dataTestId,
  children,
}: DialogContentProps) {
  return (
    <motion.div data-testid={dataTestId} className="dialog-content-container">
      {children}
    </motion.div>
  )
}

function DialogDimBackground({ onClose }: { onClose: () => void }) {
  return createPortal(
    <motion.div className="dialog-dim-background" onClick={onClose} />,
    document.body
  )
}

export default Dialog
export { DialogContent }
