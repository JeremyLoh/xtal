import { Outlet } from "react-router"
import { Toaster } from "sonner"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"
import Header from "./components/Header/Header.tsx"
import Footer from "./components/Footer/Footer.tsx"

const toastOptions = {
  className: "toaster",
  duration: 2000,
}

export default function Root() {
  return (
    <>
      <Toaster
        position="bottom-right"
        expand={true}
        richColors
        toastOptions={toastOptions}
      />
      <Header />
      <main>
        <Outlet />
        <Analytics />
        <SpeedInsights />
      </main>
      <Footer />
    </>
  )
}
