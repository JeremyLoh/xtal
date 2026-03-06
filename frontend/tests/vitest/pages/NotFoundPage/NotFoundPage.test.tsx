import { screen } from "@testing-library/react"
import NotFoundPage from "@/pages/NotFoundPage/NotFoundPage"
import { customRender } from "@tests/vitest/testUtils/renderElement.tsx"

describe(NotFoundPage.name, () => {
  test("should display header", () => {
    customRender(<NotFoundPage />)

    expect(screen.getByRole("link", { name: "Podcast" })).toBeVisible()
    expect(screen.getByRole("link", { name: "Radio" })).toBeVisible()
  })

  test("should display footer", () => {
    customRender(<NotFoundPage />)

    expect(screen.getByText("Listen to the World")).toBeVisible()
    expect(screen.getByText("© Jeremy_Loh")).toBeVisible()
    expect(screen.getByLabelText("Github link for Jeremy Loh")).toBeVisible()
  })

  test("should display 404 error message", () => {
    customRender(<NotFoundPage />)

    expect(screen.getByRole("heading", { name: "404 Not Found" })).toBeVisible()
  })

  test("should display frown face icon", () => {
    customRender(<NotFoundPage />)

    expect(screen.getByTestId("frown-face-icon")).toBeVisible()
  })

  test("should have return home link", () => {
    customRender(<NotFoundPage />)

    const link = screen.getByRole("link", { name: "Return Home" })

    expect(link).toBeVisible()
    expect(link).toHaveAttribute("href", "/")
  })
})
