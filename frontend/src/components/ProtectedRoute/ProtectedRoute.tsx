import { lazy } from "react"
import type { ReactElement } from "react"
import { SessionAuth } from "supertokens-auth-react/recipe/session/index"

const HomePage = lazy(() => import("../../pages/HomePage/HomePage.tsx"))

export default function ProtectedRoute({
  children,
}: Readonly<{
  children: ReactElement
}>) {
  return (
    <SessionAuth onSessionExpired={() => <HomePage />}>{children}</SessionAuth>
  )
}
