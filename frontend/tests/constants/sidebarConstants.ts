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
  Radio = "Radio",
  Podcasts = "Podcasts",
  ProfileSignIn = "Sign In",
  ProfileSignUp = "Sign Up",
}

export function getSidebarMenuItem(page: Page, action: SidebarMenuItemAction) {
  return page
    .locator(".sidebar-menu-item")
    .getByRole("link", { name: action.toString(), exact: true })
}

export async function navigateUsingSidebarMenuItem(
  page: Page,
  action: SidebarMenuItemAction
) {
  const isSidebarVisible = await getSidebarElement(page).isVisible()
  if (!isSidebarVisible) {
    await getSidebarToggleButton(page).click()
  }
  await expect(getSidebarElement(page)).toBeVisible()
  await expect(getSidebarMenuItem(page, action)).toBeVisible()
  await getSidebarMenuItem(page, action).click()
}
