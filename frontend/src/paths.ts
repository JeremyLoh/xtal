export const homePage = () => "/"
export const aboutPage = () => "/about"
export const profilePage = () => "/profile"
export const profileHistoryPage = () => "/profile/history"
export const profileFollowingPage = () => "/profile/following"
export const signUpPage = () => "/auth?show=signup"
export const signInPage = () => "/auth?show=signin"
export const notFoundPage = () => "/404"
export const resetPasswordPage = () => "/auth/reset-password"
export const radioStationPage = (stationUuid: string) =>
  `/radio-station/${stationUuid}`
export const podcastHomePage = () => "/podcasts"
export const podcastSearchPage = (query: string) => {
  if (query.trim() === "") {
    return "/podcasts/search"
  }
  return `/podcasts/search?q=${encodeURIComponent(query)}`
}
export const podcastCategoryPage = (categoryName: string) => {
  // category should be in Title Case format (e.g. "Arts")
  if (categoryName.trim() === "") {
    return "/podcasts" // redirect to podcast homepage if category is empty
  }
  const categoryTrim = categoryName.trim()
  const categoryTitleCase =
    categoryTrim.length > 1
      ? categoryTrim[0].toUpperCase() + categoryTrim.slice(1).toLowerCase()
      : categoryTrim.toUpperCase()
  return `/podcasts/${categoryTitleCase}`
}
export const podcastDetailPage = ({
  podcastTitle,
  podcastId,
}: {
  podcastTitle: string
  podcastId: string
}) => {
  return `/podcasts/${encodeURIComponent(podcastTitle)}/${podcastId}`
}
export const podcastEpisodeDetailPage = ({
  podcastTitle,
  podcastId,
  episodeId,
}: {
  podcastTitle: string
  podcastId: string
  episodeId: string
}) => {
  return `/podcasts/${encodeURIComponent(
    podcastTitle
  )}/${podcastId}/${episodeId}`
}
