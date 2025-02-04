import "./index.css"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router"
import ThemeProvider from "./context/ThemeProvider/ThemeProvider.tsx"
import MapProvider from "./context/MapProvider/MapProvider.tsx"
import FavouriteStationsProvider from "./context/FavouriteStationsProvider/FavouriteStationsProvider.tsx"
import Root from "./Root.tsx"
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage.tsx"
import HomePage from "./pages/HomePage/HomePage.tsx"
import RadioStation from "./pages/RadioStation/RadioStation.tsx"
import HomeLayout from "./pages/HomeLayout/HomeLayout.tsx"
import PodcastHomePage from "./pages/podcast/PodcastHomePage/PodcastHomePage.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <MapProvider>
        <FavouriteStationsProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Root />}>
                <Route element={<HomeLayout />}>
                  <Route index element={<HomePage />} />
                  <Route
                    path="radio-station/:stationuuid"
                    element={<RadioStation />}
                  />
                </Route>
                <Route path="/podcasts" element={<PodcastHomePage />} />
              </Route>
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </FavouriteStationsProvider>
      </MapProvider>
    </ThemeProvider>
  </StrictMode>
)
