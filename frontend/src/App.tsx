import { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route } from "react-router"
import Root from "./Root.tsx"
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary.tsx"
import { SessionAuth } from "supertokens-auth-react/recipe/session/index"
import { getSuperTokensRoutes } from "./api/auth/superTokens.ts"

const SuspenseFallbackPage = lazy(
  () => import("./pages/SuspenseFallbackPage/SuspenseFallbackPage.tsx")
)
const NotFoundPage = lazy(() => import("./pages/NotFoundPage/NotFoundPage.tsx"))
const HomeLayout = lazy(() => import("./pages/HomeLayout/HomeLayout.tsx"))
const HomePage = lazy(() => import("./pages/HomePage/HomePage.tsx"))
const AboutPage = lazy(() => import("./pages/AboutPage/AboutPage.tsx"))
const RadioStationDisplayPage = lazy(
  () => import("./pages/RadioStationDisplayPage/RadioStationDisplayPage.tsx")
)
const PodcastLayout = lazy(
  () => import("./pages/PodcastLayout/PodcastLayout.tsx")
)
const PodcastHomePage = lazy(
  () => import("./pages/podcast/PodcastHomePage/PodcastHomePage.tsx")
)
const PodcastDetailPage = lazy(
  () => import("./pages/podcast/PodcastDetailPage/PodcastDetailPage.tsx")
)
const PodcastEpisodeDetailPage = lazy(
  () =>
    import(
      "./pages/podcast/PodcastEpisodeDetailPage/PodcastEpisodeDetailPage.tsx"
    )
)
const PodcastCategoryPage = lazy(
  () => import("./pages/podcast/PodcastCategoryPage/PodcastCategoryPage.tsx")
)
const PodcastSearchPage = lazy(
  () => import("./pages/podcast/PodcastSearchPage/PodcastSearchPage.tsx")
)
const ProfilePage = lazy(() => import("./pages/ProfilePage/ProfilePage.tsx"))
const ProfileHistoryPage = lazy(
  () => import("./pages/ProfileHistoryPage/ProfileHistoryPage.tsx")
)
const ProfileFollowingPage = lazy(
  () => import("./pages/ProfileFollowingPage/ProfileFollowingPage.tsx")
)

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary fallback={<NotFoundPage />}>
        <Suspense fallback={<SuspenseFallbackPage />}>
          <Routes>
            <Route path="/" element={<Root />}>
              {/*renders prebuilt login UI on /auth route*/}
              {getSuperTokensRoutes()}
              <Route path="/about" element={<AboutPage />} />
              <Route element={<HomeLayout />}>
                <Route index element={<HomePage />} />
                <Route
                  path="radio-station/:stationuuid"
                  element={<RadioStationDisplayPage />}
                />
              </Route>
              <Route element={<PodcastLayout />}>
                <Route
                  path="/profile"
                  element={
                    <SessionAuth onSessionExpired={() => <HomePage />}>
                      <ProfilePage />
                    </SessionAuth>
                  }
                />
                <Route
                  path="/profile/history"
                  element={
                    <SessionAuth onSessionExpired={() => <HomePage />}>
                      <ProfileHistoryPage />
                    </SessionAuth>
                  }
                />
                <Route
                  path="/profile/following"
                  element={
                    <SessionAuth onSessionExpired={() => <HomePage />}>
                      <ProfileFollowingPage />
                    </SessionAuth>
                  }
                />

                <Route path="/podcasts" element={<PodcastHomePage />} />
                <Route
                  path="/podcasts/:podcastTitle/:podcastId"
                  element={<PodcastDetailPage />}
                />
                <Route
                  path="/podcasts/:podcastTitle/:podcastId/:podcastEpisodeId"
                  element={<PodcastEpisodeDetailPage />}
                />
                <Route
                  path="/podcasts/:categoryName"
                  element={<PodcastCategoryPage />}
                />
                <Route
                  path="/podcasts/search"
                  element={<PodcastSearchPage />}
                />
              </Route>
            </Route>
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  )
}
