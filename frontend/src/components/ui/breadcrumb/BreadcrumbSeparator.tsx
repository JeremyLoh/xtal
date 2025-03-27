import { RxSlash } from "react-icons/rx"

type BreadcrumbSeparatorProps = {
  size: number
}

function BreadcrumbSeparator({ size }: BreadcrumbSeparatorProps) {
  return <RxSlash size={size} />
}

export default BreadcrumbSeparator
export type { BreadcrumbSeparatorProps }
