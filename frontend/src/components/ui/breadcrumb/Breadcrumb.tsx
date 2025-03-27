import "./Breadcrumb.css"
import { memo, PropsWithChildren } from "react"

type BreadcrumbProps = PropsWithChildren & {}

function Breadcrumb({ children }: BreadcrumbProps) {
  return <div className="breadcrumb-container">{children}</div>
}

export default memo(Breadcrumb)
export type { BreadcrumbProps }
