import { test } from "../../fixture/test"
import { expect } from "@playwright/test"
import {
  clickRandomRadioStationButton,
  getNavbarPodcastLink,
  getNavbarRadioLink,
  getRadioCardMapPopup,
  getRadioStationMapPopupCloseButton,
  HOMEPAGE,
} from "../../constants/homepageConstants"
import {
  getFavouriteStationsDrawer,
  getRadioCardFavouriteIcon,
  openFavouriteStationsDrawer,
} from "../../constants/favouriteStationConstants"
import { unitedStatesStation } from "../../mocks/station"
import {
  navigateUsingSidebarMenuItem,
  SidebarMenuItemAction,
} from "../../constants/sidebarConstants"

test.beforeEach(async ({ mapPage }) => {
  await mapPage.mockMapTile()
})

test.describe("Podcast Homepage /podcasts", () => {
  test("should display title", async ({ page }) => {
    await page.goto(HOMEPAGE + "/podcasts")
    await expect(page).toHaveTitle(/xtal - podcasts/)
  })

  test("should navigate back to homepage (/) header navbar radio link is clicked", async ({
    page,
    isMobile,
  }) => {
    await page.goto(HOMEPAGE + "/podcasts")
    await expect(page).toHaveTitle(/xtal - podcasts/)
    expect(page.url()).toMatch(/\/podcasts$/)
    if (isMobile) {
      await navigateUsingSidebarMenuItem(page, SidebarMenuItemAction.Radio)
    } else {
      await getNavbarRadioLink(page).click()
    }
    await expect(page).not.toHaveTitle(/xtal - podcasts/)
    expect(page.url()).not.toMatch(/\/podcasts$/)
  })

  test("should load favourite station and navigate back to homepage when load station button is clicked in favourite stations drawer", async ({
    page,
    headless,
    isMobile,
  }) => {
    test.skip(headless, "Remove flaky test in headless mode")
    await page.route("*/**/json/stations/search?*", async (route) => {
      const json = [unitedStatesStation]
      await route.fulfill({ json })
    })
    await page.goto(HOMEPAGE)
    await clickRandomRadioStationButton(page)
    await expect(getRadioCardFavouriteIcon(page)).toBeVisible()
    await getRadioCardFavouriteIcon(page).click()
    await getRadioStationMapPopupCloseButton(page).click()

    if (isMobile) {
      await navigateUsingSidebarMenuItem(page, SidebarMenuItemAction.Podcasts)
    } else {
      await getNavbarPodcastLink(page).click()
    }
    await openFavouriteStationsDrawer(page)
    await getFavouriteStationsDrawer(page)
      .locator(".favourite-station")
      .getByRole("button", {
        name: "load station",
      })
      .click()
    await expect(
      getRadioCardMapPopup(page).getByRole("heading", {
        name: unitedStatesStation.name,
        exact: true,
      })
    ).toBeVisible()
    expect(page.url()).not.toMatch(/\/podcasts$/)
  })
})
