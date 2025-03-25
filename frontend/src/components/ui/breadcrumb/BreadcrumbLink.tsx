import { PropsWithChildren } from "react"
import { Link } from "react-router"

type BreadcrumbLinkProps = PropsWithChildren & {
  href: string
}

function BreadcrumbLink({ href, children }: BreadcrumbLinkProps) {
  return (
    <Link to={href} style={{ width: "fit-content", fontWeight: "bold" }}>
      {children}
    </Link>
  )
}

export default BreadcrumbLink
export type { BreadcrumbLinkProps }
