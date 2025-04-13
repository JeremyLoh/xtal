export const homePage = () => "/"
export const profilePage = () => "/profile"
export const profileHistoryPage = () => "/profile/history"
export const signUpPage = () => "/auth?show=signup"
export const notFoundPage = () => "/404"
export const podcastHomePage = () => "/podcasts"
export const podcastCategoryPage = (categoryName: string) =>
  `/podcasts/${categoryName}`
