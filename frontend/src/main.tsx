import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import ThemeProvider from "./context/ThemeProvider/ThemeProvider.tsx"
import MapProvider from "./context/MapProvider/MapProvider.tsx"
import FavouriteStationsProvider from "./context/FavouriteStationsProvider/FavouriteStationsProvider.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <MapProvider>
        <FavouriteStationsProvider>
          <App />
        </FavouriteStationsProvider>
      </MapProvider>
    </ThemeProvider>
  </StrictMode>
)
