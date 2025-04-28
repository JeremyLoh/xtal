export const homePage = () => "/"
export const profilePage = () => "/profile"
export const profileHistoryPage = () => "/profile/history"
export const profileFollowingPage = () => "/profile/following"
export const signUpPage = () => "/auth?show=signup"
export const notFoundPage = () => "/404"
export const resetPasswordPage = () => "/auth/reset-password"
export const podcastHomePage = () => "/podcasts"
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
