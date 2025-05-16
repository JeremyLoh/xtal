import { expect, Page } from "@playwright/test"

export function getSidebarToggleButton(page: Page) {
  return page.getByTestId("sidebar-toggle-button")
}

export function getSidebarElement(page: Page) {
  return page.getByTestId("sidebar")
}

export function getSidebarCloseButton(page: Page) {
  return page.getByTestId("sidebar-close-button")
}

export function getSidebarTitle(page: Page) {
  return page.getByTestId("sidebar-title")
}

export enum SidebarMenuItemAction {
  // contains the data-testid values for the sidebar menu item
  Radio = "sidebar-menu-item-radio",
  Podcasts = "sidebar-menu-item-podcasts",
  RadioFavouriteStations = "sidebar-menu-item-radio-view-favourite-stations",
  Profile = "sidebar-menu-item-profile",
  ProfileFollowing = "sidebar-menu-item-profile-following",
  ProfileListenHistory = "sidebar-menu-item-profile-listen-history",
  ProfileSignIn = "sidebar-menu-item-profile-sign-in",
  ProfileSignUp = "sidebar-menu-item-profile-sign-up",
  ProfileLogout = "sidebar-menu-item-profile-logout",
  ProfileResetPassword = "sidebar-menu-item-profile-reset-password",
}

export function getSidebarMenuItem(page: Page, action: SidebarMenuItemAction) {
  return page.locator(".sidebar-menu-item").getByTestId(action)
}

export async function navigateUsingSidebarMenuItem(
  page: Page,
  action: SidebarMenuItemAction
) {
  await getSidebarToggleButton(page).click()
  await expect(getSidebarElement(page)).toBeVisible()
  await expect(getSidebarMenuItem(page, action)).toBeVisible()
  await getSidebarMenuItem(page, action).click()
}
