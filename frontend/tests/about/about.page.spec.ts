import { expect } from "@playwright/test"
import { test } from "../fixture/test"
import { HOMEPAGE } from "../constants/homepageConstants"

test.describe("About Page", () => {
  test("should display 'Why listen to podcasts / radio' section", async ({
    page,
  }) => {
    const expectedCardTexts = [
      "Discover new interests across a large variety of categories",
      "Obtain expert insights and learn on the go",
      "Practice your active listening skills",
      "Experience different cultures and perspectives",
    ]
    await page.goto(HOMEPAGE + "/about")
    await expect(page).toHaveTitle("xtal - about")
    await expect(
      page.getByText(
        "Immerse yourself in the world by exploring podcasts and radio stations from around the world using xtal!"
      )
    ).toBeVisible()
    await expect(page.getByText("Why listen to podcasts/radio?")).toBeVisible()
    for (const expectedText of expectedCardTexts) {
      await expect(
        page
          .locator(".about-section-card")
          .getByText(expectedText, { exact: true })
      ).toBeVisible()
    }
  })

  test("should display creator section", async ({ page }) => {
    await page.goto(HOMEPAGE + "/about")
    await expect(page).toHaveTitle("xtal - about")
    await expect(page.getByTestId("jeremy-profile-picture")).toBeVisible()
    await expect(
      page.getByText("👋 Hi, I'm Jeremy Loh (@Jeremy_Loh)")
    ).toBeVisible()
    await expect(
      page.getByText(
        "I'm a Software Engineer who loves Photography. When I'm not programming, you can find me behind a camera!"
      )
    ).toBeVisible()
  })
})
