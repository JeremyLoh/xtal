import { PropsWithChildren } from "react"

type BreadcrumbItemProps = PropsWithChildren

function BreadcrumbItem({ children }: BreadcrumbItemProps) {
  return <span style={{ width: "fit-content" }}>{children}</span>
}

export default BreadcrumbItem
export type { BreadcrumbItemProps }
