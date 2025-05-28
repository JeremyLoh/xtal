import test, { expect } from "@playwright/test"
import { HOMEPAGE } from "../../constants/homepageConstants"
import { fiveNewReleasePodcasts } from "../../mocks/podcast.new.release"
import { assertNewReleasePodcasts } from "../../constants/podcast/newRelease/podcastNewReleaseConstants"

test.describe("New Release Podcasts Section on Podcast Homepage /podcasts", () => {
  test("should display five new release podcasts section", async ({ page }) => {
    await page.route("*/**/api/podcast/recent?limit=5", async (route) => {
      const json = fiveNewReleasePodcasts
      await route.fulfill({ json })
    })
    await page.goto(HOMEPAGE + "/podcasts")
    await expect(page.getByText("New Releases")).toBeVisible()
    await expect(
      page.getByText("Latest podcasts with new episodes")
    ).toBeVisible()
    await assertNewReleasePodcasts(page, fiveNewReleasePodcasts.data)
  })
})
