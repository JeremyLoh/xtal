import { Page } from "@playwright/test"

export const HOMEPAGE = "http://localhost:5173"

export async function clickRandomRadioStationButton(page: Page) {
  await page.getByTestId("random-radio-station-btn").click()
}
