import { Page } from "@playwright/test"
import {
  navigateUsingSidebarMenuItem,
  SidebarMenuItemAction,
} from "./sidebarConstants"

export async function openFavouriteStationsDrawer(page: Page) {
  await navigateUsingSidebarMenuItem(
    page,
    SidebarMenuItemAction.RadioFavouriteStations
  )
}

export function getFavouriteStationsDrawer(page: Page) {
  return page.locator(".drawer")
}

export async function closeFavouriteStationsDrawer(page: Page) {
  await page.locator(".drawer-close-button").click()
}

export function getRadioCardFavouriteIcon(page: Page) {
  return page.locator("#map .radio-card .station-card-favourite-icon")
}
