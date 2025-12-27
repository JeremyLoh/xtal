import "./Button.css"
import { ComponentPropsWithoutRef, memo, PropsWithChildren } from "react"
import { AnimatePresence, motion } from "motion/react"

const buttonTransition = { duration: 0.2, type: "spring" }
const buttonWhileHover = { scale: 1.01 }
const buttonWhileTap = { scale: 0.98 }

type ButtonProps = PropsWithChildren &
  ComponentPropsWithoutRef<"button"> & {
    keyProp: string
    variant?: "primary" | "secondary" | "danger" | "icon"
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
    <AnimatePresence>
      {/* @ts-expect-error {...rest} will be valid props */}
      <motion.button
        key={keyProp}
        className={`button ${variant ?? ""} ${className ?? ""}`.trim()}
        transition={buttonTransition}
        whileHover={buttonWhileHover}
        whileTap={buttonWhileTap}
        {...rest}
      >
        {children}
      </motion.button>
    </AnimatePresence>
  )
}

export default memo(Button)
