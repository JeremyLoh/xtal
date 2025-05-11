import { PropsWithChildren } from "react"
import { Link } from "react-router"

const breadcrumbLinkStyle = { width: "fit-content", fontWeight: "bold" }

type BreadcrumbLinkProps = PropsWithChildren & {
  href: string
  "data-testid"?: string
}

function BreadcrumbLink({
  href,
  "data-testid": dataTestId,
  children,
}: BreadcrumbLinkProps) {
  return (
    <Link
      to={href}
      style={breadcrumbLinkStyle}
      data-testid={dataTestId ? dataTestId : null}
    >
      {children}
    </Link>
  )
}

export default BreadcrumbLink
export type { BreadcrumbLinkProps }
