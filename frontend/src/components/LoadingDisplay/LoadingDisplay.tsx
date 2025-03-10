import { PropsWithChildren } from "react"
import Spinner from "../Spinner/Spinner.tsx"

type LoadingDisplayProps = PropsWithChildren & {
  loading: boolean
}

export default function LoadingDisplay({
  loading,
  children,
}: LoadingDisplayProps) {
  if (loading) {
    return <Spinner isLoading={loading} />
  }
  return children
}
