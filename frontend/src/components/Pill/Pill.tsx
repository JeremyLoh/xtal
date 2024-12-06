import "./Pill.css"

type PillProps = {
  children: React.ReactNode
  className?: string
}

function Pill(props: PillProps) {
  return (
    <span className={`pill ${props.className || ""}`}>{props.children}</span>
  )
}

export default Pill
