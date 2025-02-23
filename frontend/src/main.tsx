import "./index.css"
import { lazy, StrictMode, Suspense } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router"
import MapProvider from "./context/MapProvider/MapProvider.tsx"
import FavouriteStationsProvider from "./context/FavouriteStationsProvider/FavouriteStationsProvider.tsx"
import Root from "./Root.tsx"
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary.tsx"
import Spinner from "./components/Spinner/Spinner.tsx"

const NotFoundPage = lazy(() => import("./pages/NotFoundPage/NotFoundPage.tsx"))
const HomeLayout = lazy(() => import("./pages/HomeLayout/HomeLayout.tsx"))
const HomePage = lazy(() => import("./pages/HomePage/HomePage.tsx"))
const RadioStation = lazy(() => import("./pages/RadioStation/RadioStation.tsx"))
const PodcastLayout = lazy(
  () => import("./pages/PodcastLayout/PodcastLayout.tsx")
)
const PodcastHomePage = lazy(
  () => import("./pages/podcast/PodcastHomePage/PodcastHomePage.tsx")
)
const PodcastDetailPage = lazy(
  () => import("./pages/podcast/PodcastDetailPage/PodcastDetailPage.tsx")
)
const PodcastCategoryPage = lazy(
  () => import("./pages/podcast/PodcastCategoryPage/PodcastCategoryPage.tsx")
)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MapProvider>
      <FavouriteStationsProvider>
        <BrowserRouter>
          <ErrorBoundary fallback={<NotFoundPage />}>
            <Suspense fallback={<Spinner isLoading={true} />}>
              <Routes>
                <Route path="/" element={<Root />}>
                  <Route element={<HomeLayout />}>
                    <Route index element={<HomePage />} />
                    <Route
                      path="radio-station/:stationuuid"
                      element={<RadioStation />}
                    />
                  </Route>
                  <Route element={<PodcastLayout />}>
                    <Route path="/podcasts" element={<PodcastHomePage />} />
                    <Route
                      path="/podcasts/:podcastTitle/:podcastId"
                      element={<PodcastDetailPage />}
                    />
                    <Route
                      path="/podcasts/:categoryName"
                      element={<PodcastCategoryPage />}
                    />
                  </Route>
                </Route>
                <Route path="/404" element={<NotFoundPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </BrowserRouter>
      </FavouriteStationsProvider>
    </MapProvider>
  </StrictMode>
)
