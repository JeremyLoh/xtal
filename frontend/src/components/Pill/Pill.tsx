import "./Pill.css"

type PillProps = {
  children: React.ReactNode
  className?: string
}

function Pill(props: Readonly<PillProps>) {
  return (
    <span className={`pill ${props.className || ""}`}>{props.children}</span>
  )
}

export default Pill
