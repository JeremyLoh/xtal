import "./index.css"
import { lazy, StrictMode, Suspense } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router"
import { SuperTokensWrapper } from "supertokens-auth-react"
import MapProvider from "./context/MapProvider/MapProvider.tsx"
import FavouriteStationsProvider from "./context/FavouriteStationsProvider/FavouriteStationsProvider.tsx"
import Root from "./Root.tsx"
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary.tsx"
import LoadingDisplay from "./components/LoadingDisplay/LoadingDisplay.tsx"
import {
  getSuperTokensRoutes,
  initializeSuperTokens,
} from "./api/auth/superTokens.ts"
import { SessionAuth } from "supertokens-auth-react/recipe/session/index"

initializeSuperTokens()

const NotFoundPage = lazy(() => import("./pages/NotFoundPage/NotFoundPage.tsx"))
const HomeLayout = lazy(() => import("./pages/HomeLayout/HomeLayout.tsx"))
const HomePage = lazy(() => import("./pages/HomePage/HomePage.tsx"))
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
const ProfilePage = lazy(() => import("./pages/ProfilePage/ProfilePage.tsx"))

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SuperTokensWrapper>
      <MapProvider>
        <FavouriteStationsProvider>
          <BrowserRouter>
            <ErrorBoundary fallback={<NotFoundPage />}>
              <Suspense fallback={<LoadingDisplay loading={true} />}>
                <Routes>
                  {/*renders prebuilt login UI on /auth route*/}
                  {getSuperTokensRoutes()}
                  <Route path="/" element={<Root />}>
                    <Route element={<HomeLayout />}>
                      <Route index element={<HomePage />} />
                      <Route
                        path="radio-station/:stationuuid"
                        element={<RadioStationDisplayPage />}
                      />
                    </Route>
                    <Route element={<PodcastLayout />}>
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
                    </Route>
                    <Route
                      path="/profile"
                      element={
                        <SessionAuth onSessionExpired={() => <HomePage />}>
                          <ProfilePage />
                        </SessionAuth>
                      }
                    />
                  </Route>
                  <Route path="/404" element={<NotFoundPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </BrowserRouter>
        </FavouriteStationsProvider>
      </MapProvider>
    </SuperTokensWrapper>
  </StrictMode>
)
