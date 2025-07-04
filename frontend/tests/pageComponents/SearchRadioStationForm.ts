import { Page } from "@playwright/test"
import Drawer from "./Drawer"

class SearchRadioStationForm {
  readonly page: Page
  readonly drawer: Drawer

  constructor(page: Page, drawer: Drawer) {
    this.page = page
    this.drawer = drawer
  }

  getForm() {
    return this.drawer
      .getDrawer()
      .locator(".drawer-content .station-search-form")
  }

  getLanguageOptions() {
    return this.getForm().locator("select#language option")
  }

  getCurrentLanguageOption() {
    return this.getForm().locator("select#language")
  }

  getSearchNameInput() {
    return this.getForm().getByLabel("Search By Name")
  }

  getSortSelect() {
    return this.getForm().locator("select#sort")
  }

  getSortOptions() {
    return this.getSortSelect().locator("option")
  }

  getTagFilterInput() {
    return this.getForm().locator("input#tag")
  }

  getSubmitButton() {
    return this.getForm().locator("button[type='submit']")
  }

  getSearchResultCards() {
    // result cards displayed after form submit
    return this.drawer.getDrawer().locator(".station-search-result-card")
  }

  getLoadMoreResultsButton() {
    return this.drawer
      .getDrawer()
      .locator(".station-search-load-more-results-button")
  }
}

export default SearchRadioStationForm
