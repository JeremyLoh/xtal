import { Outlet } from "react-router"
import { Toaster } from "sonner"
import Header from "./components/Header/Header"
import Footer from "./components/Footer/Footer"

export default function Root() {
  return (
    <>
      <Toaster
        position="bottom-right"
        expand={true}
        richColors
        toastOptions={{
          className: "toaster",
        }}
      />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}