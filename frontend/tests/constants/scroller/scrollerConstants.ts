import { expect, Locator, Page } from "@playwright/test"

export function getVirtualizedListParentElement(page: Page) {
  // react-virtuoso <Virtuoso /> element container
  return page.getByTestId("virtuoso-scroller")
}

export async function scrollUntilElementIsVisible(
  page: Page,
  locator: Locator,
  parentContainer: Locator
) {
  while (!(await locator.isVisible())) {
    await parentContainer.evaluate((e) => e.scrollBy({ top: 50 }))
    await page.waitForTimeout(200) // wait for possible animations and image to load (swap placeholder image with real image)
  }
  await locator.scrollIntoViewIfNeeded()
}

export async function scrollToTop(elementLocator: Locator) {
  await expect(elementLocator).toBeVisible()
  const box = await elementLocator.boundingBox()
  if (!box) {
    throw new Error(
      `scrollToTop(): could not find bounding box of elementLocator ${elementLocator}`
    )
  }
  let previousScrollY = 0
  while (true) {
    const currentScrollPosition = await elementLocator.evaluate(
      (e: HTMLElement) => {
        const scrollY = e.scrollTop
        return e.clientHeight + scrollY
      }
    )
    const isScrollEnded = previousScrollY === currentScrollPosition
    if (isScrollEnded) {
      break
    } else {
      previousScrollY = currentScrollPosition
    }
    await elementLocator.evaluate((e) => e.scrollBy({ top: -500 }))
  }
}
