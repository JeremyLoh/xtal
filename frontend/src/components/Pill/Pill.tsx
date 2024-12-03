import "./Pill.css"

type PillProps = {
  key: string
  children: React.ReactNode
}

function Pill(props: PillProps) {
  return (
    <span className="pill" key={props.key}>
      {props.children}
    </span>
  )
}

export default Pill
