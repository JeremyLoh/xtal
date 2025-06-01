export const homePageUrl = () => "http://localhost:5173"
export const aboutPageUrl = () => homePageUrl() + "/about"
export const radioStationShareUrl = (stationUuid: string) =>
  homePageUrl() + `/radio-station/${stationUuid}`
export const podcastHomePageUrl = () => homePageUrl() + "/podcasts"
export const signUpPageUrl = () => homePageUrl() + "/auth?show=signup"
export const signInPageUrl = () => homePageUrl() + "/auth?show=signin"
export const podcastSearchPageUrl = (query: string) => {
  if (query.trim() === "") {
    return homePageUrl() + "/podcasts/search"
  }
  return homePageUrl() + `/podcasts/search?q=${encodeURIComponent(query)}`
}
