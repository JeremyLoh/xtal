import "./PodcastLayout.css"
import { preconnect } from "react-dom"
import { Outlet } from "react-router"
import PodcastPlayer from "../../features/podcast/player/PodcastPlayer"

const BACKEND_ORIGIN: string = import.meta.env.VITE_BACKEND_ORIGIN

export default function PodcastLayout() {
  preconnect(BACKEND_ORIGIN)

  return (
    <>
      <div className="sticky-top">
        <PodcastPlayer />
      </div>
      <div className="podcast-content-container">
        <Outlet />
      </div>
    </>
  )
}
