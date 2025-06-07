import { test } from "./fixture/test"
import { expect } from "@playwright/test"
import { assertLoadingSpinnerIsMissing } from "./constants/loadingConstants"
import { SidebarMenuItemAction } from "./pageComponents/Sidebar"
import {
  aboutPageUrl,
  homePageUrl,
  podcastHomePageUrl,
  podcastSearchPageUrl,
  signInPageUrl,
  signUpPageUrl,
} from "./constants/paths"

test.describe("Homepage Sidebar", () => {
  test("should open sidebar on header action toggle sidebar button click", async ({
    homePage,
  }) => {
    await homePage.goto()
    await assertLoadingSpinnerIsMissing(homePage.getPage())
    await expect(homePage.getSidebarToggleButton()).toBeVisible()
    await expect(homePage.getSidebar()).not.toBeVisible()
    await homePage.getSidebarToggleButton().click()
    await expect(homePage.getSidebar()).toBeVisible()
    await expect(homePage.getSidebarTitle()).toHaveText("Actions")
  })

  test("should close sidebar on header action toggle sidebar button click", async ({
    homePage,
  }) => {
    await homePage.goto()
    await assertLoadingSpinnerIsMissing(homePage.getPage())
    await expect(homePage.getSidebarToggleButton()).toBeVisible()
    await expect(homePage.getSidebar()).not.toBeVisible()
    await homePage.getSidebarToggleButton().click()
    await expect(homePage.getSidebar()).toBeVisible()
    await homePage.getSidebarToggleButton().click()
    await expect(homePage.getSidebar()).not.toBeVisible()
  })

  test("should close sidebar on sidebar close button click", async ({
    homePage,
  }) => {
    await homePage.goto()
    await assertLoadingSpinnerIsMissing(homePage.getPage())
    await homePage.getSidebarToggleButton().click()
    await expect(homePage.getSidebar()).toBeVisible()
    await expect(homePage.getSidebarCloseButton()).toBeVisible()
    await homePage.getSidebarCloseButton().click()
    await expect(homePage.getSidebar()).not.toBeVisible()
  })

  test("should close sidebar on click outside sidebar", async ({
    homePage,
  }) => {
    await homePage.goto()
    await assertLoadingSpinnerIsMissing(homePage.getPage())
    await homePage.getSidebarToggleButton().click()
    await expect(homePage.getSidebar()).toBeVisible()
    // click outside of sidebar element
    await homePage
      .getPage()
      .locator("body")
      .click({ position: { x: 1, y: 1 } })
    await expect(homePage.getSidebar()).not.toBeVisible()
  })

  test("should close sidebar on podcast action click", async ({ homePage }) => {
    await homePage.goto()
    await assertLoadingSpinnerIsMissing(homePage.getPage())
    await homePage.getSidebarToggleButton().click()
    await expect(homePage.getSidebar()).toBeVisible()
    await homePage.getSidebarMenuItem(SidebarMenuItemAction.Podcasts).click()
    await expect(homePage.getSidebar()).not.toBeVisible()
  })

  test("should not close sidebar on click inside sidebar", async ({
    homePage,
  }) => {
    await homePage.goto()
    await assertLoadingSpinnerIsMissing(homePage.getPage())
    await homePage.getSidebarToggleButton().click()
    await expect(homePage.getSidebar()).toBeVisible()
    await homePage.getSidebarTitle().click()
    await expect(homePage.getSidebar()).toBeVisible()
  })

  test("should display sidebar navigation action links", async ({
    homePage,
  }) => {
    await homePage.goto()
    await assertLoadingSpinnerIsMissing(homePage.getPage())
    await homePage.getSidebarToggleButton().click()
    await expect(homePage.getSidebar()).toBeVisible()
    await expect(
      homePage.getSidebarMenuItem(SidebarMenuItemAction.Radio)
    ).toBeVisible()
    await expect(
      homePage.getSidebarMenuItem(SidebarMenuItemAction.Podcasts)
    ).toBeVisible()
    await expect(
      homePage.getSidebarMenuItem(SidebarMenuItemAction.PodcastSearch)
    ).toBeVisible()
    await expect(
      homePage.getSidebarMenuItem(SidebarMenuItemAction.RadioFavouriteStations)
    ).toBeVisible()
    await expect(
      homePage.getSidebarMenuItem(SidebarMenuItemAction.ProfileSignIn)
    ).toBeVisible()
    await expect(
      homePage.getSidebarMenuItem(SidebarMenuItemAction.ProfileSignUp)
    ).toBeVisible()
    await expect(
      homePage.getSidebarMenuItem(SidebarMenuItemAction.About)
    ).toBeVisible()
  })

  test.describe("Profile sidebar actions", () => {
    test("should display sidebar sign in action link for anonymous user", async ({
      homePage,
    }) => {
      await homePage.goto()
      await assertLoadingSpinnerIsMissing(homePage.getPage())
      await homePage.getSidebarToggleButton().click()
      await expect(homePage.getSidebar()).toBeVisible()
      await expect(
        homePage.getSidebarMenuItem(SidebarMenuItemAction.ProfileSignIn)
      ).toBeVisible()
      await homePage
        .getSidebarMenuItem(SidebarMenuItemAction.ProfileSignIn)
        .click()
      await expect(homePage.getPage()).toHaveURL(signInPageUrl())
    })

    test("should display sidebar sign up action link for anonymous user", async ({
      homePage,
    }) => {
      await homePage.goto()
      await assertLoadingSpinnerIsMissing(homePage.getPage())
      await homePage.getSidebarToggleButton().click()
      await expect(homePage.getSidebar()).toBeVisible()
      await expect(
        homePage.getSidebarMenuItem(SidebarMenuItemAction.ProfileSignUp)
      ).toBeVisible()
      await homePage
        .getSidebarMenuItem(SidebarMenuItemAction.ProfileSignUp)
        .click()
      await expect(homePage.getPage()).toHaveURL(signUpPageUrl())
    })
  })

  test.describe("navigate to page on click", () => {
    test("should navigate to podcast homepage on click of podcast sidebar action link", async ({
      homePage,
    }) => {
      await homePage.goto()
      await assertLoadingSpinnerIsMissing(homePage.getPage())
      await homePage.getSidebarToggleButton().click()
      await expect(homePage.getSidebar()).toBeVisible()
      await expect(
        homePage.getSidebarMenuItem(SidebarMenuItemAction.Podcasts)
      ).toBeVisible()
      await homePage.getSidebarMenuItem(SidebarMenuItemAction.Podcasts).click()
      await expect(homePage.getPage()).toHaveURL(podcastHomePageUrl())
    })

    test("should navigate to radio homepage on click of radio sidebar action link", async ({
      podcastHomePage,
    }) => {
      await podcastHomePage.goto()
      await assertLoadingSpinnerIsMissing(podcastHomePage.getPage())
      await podcastHomePage.getSidebarToggleButton().click()
      await expect(podcastHomePage.getSidebar()).toBeVisible()
      await expect(
        podcastHomePage.getSidebarMenuItem(SidebarMenuItemAction.Radio)
      ).toBeVisible()
      await podcastHomePage
        .getSidebarMenuItem(SidebarMenuItemAction.Radio)
        .click()
      await expect(podcastHomePage.getPage()).toHaveURL(homePageUrl())
    })

    test("should navigate to about page on click of about sidebar action link", async ({
      homePage,
    }) => {
      await homePage.goto()
      await assertLoadingSpinnerIsMissing(homePage.getPage())
      await homePage.getSidebarToggleButton().click()
      await expect(homePage.getSidebar()).toBeVisible()
      await expect(
        homePage.getSidebarMenuItem(SidebarMenuItemAction.About)
      ).toBeVisible()
      await homePage.getSidebarMenuItem(SidebarMenuItemAction.About).click()
      await expect(homePage.getSidebar()).not.toBeVisible()
      await expect(homePage.getPage()).toHaveURL(aboutPageUrl())
      await homePage.getPage().waitForLoadState("networkidle")
      await expect(
        homePage.getPage().getByText("404 Not Found")
      ).not.toBeVisible()
    })

    test("should navigate to podcast search page on click of search sidebar action link", async ({
      homePage,
    }) => {
      await homePage.goto()
      await assertLoadingSpinnerIsMissing(homePage.getPage())
      await homePage.getSidebarToggleButton().click()
      await expect(homePage.getSidebar()).toBeVisible()
      await expect(
        homePage.getSidebarMenuItem(SidebarMenuItemAction.PodcastSearch)
      ).toBeVisible()
      await homePage
        .getSidebarMenuItem(SidebarMenuItemAction.PodcastSearch)
        .click()
      await expect(homePage.getPage()).toHaveURL(podcastSearchPageUrl(""))
      await homePage.getPage().waitForLoadState("networkidle")
      await expect(
        homePage.getPage().getByText("404 Not Found")
      ).not.toBeVisible()
    })
  })
})
