import { PropsWithChildren } from "react"

type BreadcrumbItemProps = PropsWithChildren

const breadcrumbItemStyle = { width: "fit-content" }

function BreadcrumbItem({ children }: BreadcrumbItemProps) {
  return <span style={breadcrumbItemStyle}>{children}</span>
}

export default BreadcrumbItem
export type { BreadcrumbItemProps }
