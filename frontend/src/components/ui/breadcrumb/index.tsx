import { FunctionComponent, lazy } from "react"
import { BreadcrumbProps } from "./Breadcrumb.tsx"
import { BreadcrumbLinkProps } from "./BreadcrumbLink.tsx"
import { BreadcrumbSeparatorProps } from "./BreadcrumbSeparator.tsx"
import { BreadcrumbItemProps } from "./BreadcrumbItem.tsx"

const Breadcrumb = lazy(() => import("./Breadcrumb.tsx"))
const BreadcrumbItem = lazy(() => import("./BreadcrumbItem.tsx"))
const BreadcrumbLink = lazy(() => import("./BreadcrumbLink.tsx"))
const BreadcrumbSeparator = lazy(() => import("./BreadcrumbSeparator.tsx"))

type BreadcrumbCompoundComponents = {
  Item: FunctionComponent<BreadcrumbItemProps>
  Link: FunctionComponent<BreadcrumbLinkProps>
  Separator: FunctionComponent<BreadcrumbSeparatorProps>
}

// https://stackoverflow.com/questions/63136659/property-does-not-exist-in-a-functional-component-with-added-functional-compon
// @ts-expect-error BreadcrumbCompoundComponents property will be defined later on
const BreadcrumbAll: FunctionComponent<BreadcrumbProps> &
  BreadcrumbCompoundComponents = Breadcrumb

BreadcrumbAll.Item = BreadcrumbItem
BreadcrumbAll.Link = BreadcrumbLink
BreadcrumbAll.Separator = BreadcrumbSeparator

export default BreadcrumbAll
