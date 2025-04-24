import "./Button.css"
import { ComponentPropsWithoutRef, memo, PropsWithChildren } from "react"
import { AnimatePresence, motion } from "motion/react"

type ButtonProps = PropsWithChildren &
  ComponentPropsWithoutRef<"button"> & {
    keyProp: string
    variant?: "primary" | "secondary" | "danger"
    className?: string
  }

function Button({
  keyProp,
  variant,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <AnimatePresence mode="popLayout">
      {/* @ts-expect-error {...rest} will be valid props */}
      <motion.button
        key={keyProp}
        className={`button ${variant ? variant : ""} ${
          className ? className : ""
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, type: "spring" }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        {...rest}
      >
        {children}
      </motion.button>
    </AnimatePresence>
  )
}

export default memo(Button)
