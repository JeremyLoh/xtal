import "./PodcastLayout.css"
import { preconnect, prefetchDNS } from "react-dom"
import { Outlet } from "react-router"
import PodcastPlayer from "../../features/podcast/player/PodcastPlayer.tsx"
import PodcastEpisodeProvider from "../../context/PodcastEpisodeProvider/PodcastEpisodeProvider.tsx"

const BACKEND_ORIGIN: string = import.meta.env.VITE_BACKEND_ORIGIN

export default function PodcastLayout() {
  preconnect(BACKEND_ORIGIN)
  prefetchDNS(BACKEND_ORIGIN)

  return (
    <PodcastEpisodeProvider>
      <div className="sticky-top">
        <PodcastPlayer />
      </div>
      <div className="podcast-content-container">
        <Outlet />
      </div>
    </PodcastEpisodeProvider>
  )
}
