import "./index.css"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router"
import App from "./App.tsx"
import ThemeProvider from "./context/ThemeProvider/ThemeProvider.tsx"
import MapProvider from "./context/MapProvider/MapProvider.tsx"
import FavouriteStationsProvider from "./context/FavouriteStationsProvider/FavouriteStationsProvider.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <MapProvider>
        <FavouriteStationsProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<App />} />
            </Routes>
          </BrowserRouter>
        </FavouriteStationsProvider>
      </MapProvider>
    </ThemeProvider>
  </StrictMode>
)
