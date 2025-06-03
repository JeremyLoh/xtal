export const homePageUrl = () => "http://localhost:5173"
export const aboutPageUrl = () => homePageUrl() + "/about"
export const signUpPageUrl = () => homePageUrl() + "/auth?show=signup"
export const signInPageUrl = () => homePageUrl() + "/auth?show=signin"
export const radioStationShareUrl = (stationUuid: string) =>
  homePageUrl() + `/radio-station/${stationUuid}`
export const podcastHomePageUrl = () => homePageUrl() + "/podcasts"
export const podcastSearchPageUrl = (query: string) => {
  if (query.trim() === "") {
    return homePageUrl() + "/podcasts/search"
  }
  return homePageUrl() + `/podcasts/search?q=${encodeURIComponent(query)}`
}
export const podcastCategoryPageUrl = (categoryName: string) => {
  // category should be in Title Case format (e.g. "Arts")
  if (categoryName.trim() === "") {
    return homePageUrl() + "/podcasts" // redirect to podcast homepage if category is empty
  }
  const categoryTrim = categoryName.trim()
  const categoryTitleCase =
    categoryTrim.length > 1
      ? categoryTrim[0].toUpperCase() + categoryTrim.slice(1).toLowerCase()
      : categoryTrim.toUpperCase()
  return homePageUrl() + `/podcasts/${categoryTitleCase}`
}
export const podcastDetailPageUrl = ({
  podcastTitle,
  podcastId,
}: {
  podcastTitle: string
  podcastId: string
}) => {
  return (
    homePageUrl() + `/podcasts/${encodeURIComponent(podcastTitle)}/${podcastId}`
  )
}
export const podcastDetailPageWithPageNumberUrl = ({
  podcastTitle,
  podcastId,
  pageNumber,
}: {
  podcastTitle: string
  podcastId: string
  pageNumber: string
}) => {
  return (
    homePageUrl() +
    `/podcasts/${encodeURIComponent(
      podcastTitle
    )}/${podcastId}?page=${pageNumber}`
  )
}
export const podcastEpisodeDetailPageUrl = ({
  podcastTitle,
  podcastId,
  podcastEpisodeId,
}: {
  podcastTitle: string
  podcastId: string
  podcastEpisodeId: string
}) => {
  return (
    homePageUrl() +
    `/podcasts/${encodeURIComponent(
      podcastTitle
    )}/${podcastId}/${podcastEpisodeId}`
  )
}
export const podcastEpisodeDetailPageWithTimestampUrl = ({
  podcastId,
  podcastTitle,
  podcastEpisodeId,
  timestampInSeconds,
}: {
  podcastId: string
  podcastTitle: string
  podcastEpisodeId: string
  timestampInSeconds: string
}) => {
  return (
    homePageUrl() +
    `/podcasts/${encodeURIComponent(
      podcastTitle
    )}/${podcastId}/${podcastEpisodeId}?t=${timestampInSeconds}`
  )
}
