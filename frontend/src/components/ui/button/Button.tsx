import "./Button.css"
import { ComponentPropsWithoutRef, memo, PropsWithChildren } from "react"

type ButtonProps = PropsWithChildren &
  ComponentPropsWithoutRef<"button"> & {
    variant?: "primary" | "secondary"
    className?: string
  }

function Button({ variant, className, children, ...rest }: ButtonProps) {
  return (
    <button
      className={`button ${variant ? variant : ""} ${
        className ? className : ""
      }`}
      {...rest}
    >
      {children}
    </button>
  )
}

export default memo(Button)
