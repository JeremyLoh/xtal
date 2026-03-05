import { ReactElement, ReactNode } from "react"
import { BrowserRouter } from "react-router"
import { render, RenderOptions } from "@testing-library/react"

const AllTheProviders = ({ children }: { children: ReactNode }) => {
  return <BrowserRouter>{children}</BrowserRouter>
}

export const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => {
  return render(ui, { wrapper: AllTheProviders, ...options })
}
