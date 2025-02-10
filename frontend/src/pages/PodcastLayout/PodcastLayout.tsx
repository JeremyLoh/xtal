import { Outlet } from "react-router"
import PodcastPlayer from "../../features/podcast/player/PodcastPlayer"

export default function PodcastLayout() {
  return (
    <>
      <PodcastPlayer />
      <Outlet />
    </>
  )
}
