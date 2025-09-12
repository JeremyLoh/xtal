import "./index.css"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SuperTokensWrapper } from "supertokens-auth-react"
import MapProvider from "./context/MapProvider/MapProvider.tsx"
import FavouriteStationsProvider from "./context/FavouriteStationsProvider/FavouriteStationsProvider.tsx"
import { initializeSuperTokens } from "./api/auth/superTokens.ts"
import App from "./App.tsx"

initializeSuperTokens()

const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SuperTokensWrapper>
        <MapProvider>
          <FavouriteStationsProvider>
            <App />
          </FavouriteStationsProvider>
        </MapProvider>
      </SuperTokensWrapper>
    </QueryClientProvider>
  </StrictMode>
)
