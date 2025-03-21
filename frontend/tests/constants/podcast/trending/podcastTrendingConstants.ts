import { Page } from "@playwright/test"

export function getPodcastCards(page: Page) {
  return page.locator(".podcast-trending-container .podcast-trending-card")
}

export function getPodcastCardDetailLink(page: Page, elementIndex: number) {
  return getPodcastCards(page)
    .nth(elementIndex)
    .locator(".podcast-trending-card-detail-link")
}
