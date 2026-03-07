import AboutPage from "@/pages/AboutPage/AboutPage"
import { customRender } from "@tests/vitest/testUtils/renderElement"
import { screen } from "@testing-library/react"

describe(AboutPage.name, () => {
  test("should render profile picture", () => {
    customRender(<AboutPage />)

    const profilePicture = screen.getByTestId("jeremy-profile-picture")
    expect(profilePicture).toBeVisible()
    expect(profilePicture).toHaveAttribute(
      "src",
      "/src/pages/AboutPage/jeremy-profile-picture.webp"
    )
  })

  test("should render intro section", () => {
    customRender(<AboutPage />)

    expect(screen.getByText("👋 Hi, I'm")).toBeVisible()
    expect(
      screen.getByText("Jeremy Loh (@Jeremy_Loh)", { selector: "b" })
    ).toBeInTheDocument()

    expect(
      screen.getByText(
        "I'm a Software Engineer who loves Photography. When I'm not programming, you can find me behind a camera!"
      )
    ).toBeVisible()
  })

  test('should render "Why listen to podcasts/radio?" section', () => {
    customRender(<AboutPage />)

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Immerse yourself in the world by exploring podcasts and radio stations from around the world using xtal!",
      })
    ).toBeVisible()

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: "Why listen to podcasts/radio?",
      })
    ).toBeVisible()

    expect(
      screen.getByText("Obtain expert insights and learn on the go")
    ).toBeVisible()

    expect(
      screen.getByText("Practice your active listening skills")
    ).toBeVisible()

    expect(
      screen.getByText("Experience different cultures and perspectives")
    ).toBeVisible()
  })
})
