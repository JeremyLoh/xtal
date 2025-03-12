import { Outlet } from "react-router"
import { Toaster } from "sonner"
import { Analytics } from "@vercel/analytics/react"
import Header from "./components/Header/Header.tsx"
import Footer from "./components/Footer/Footer.tsx"

export default function Root() {
  return (
    <>
      <Toaster
        position="bottom-right"
        expand={true}
        richColors
        toastOptions={{
          className: "toaster",
          duration: 2000,
        }}
      />
      <Header />
      <main>
        <Outlet />
        <Analytics />
      </main>
      <Footer />
    </>
  )
}
