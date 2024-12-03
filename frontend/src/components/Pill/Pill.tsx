import "./Pill.css"

type PillProps = {
  children: React.ReactNode
}

function Pill(props: PillProps) {
  return <span className="pill">{props.children}</span>
}

export default Pill
