import "./Separator.css"
import { memo } from "react"

type SeparatorProps = {
  size?: number
}

function Separator({ size = 1 }: SeparatorProps) {
  return <hr className="separator" style={{ borderWidth: size }} />
}

export default memo(Separator)
