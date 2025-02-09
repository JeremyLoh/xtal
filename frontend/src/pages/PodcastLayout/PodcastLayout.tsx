import "./PodcastLayout.css"
import { Outlet } from "react-router"
import AudioPlayer from "../../components/AudioPlayer/AudioPlayer"

export default function PodcastLayout() {
  return (
    <>
      <div className="podcast-player">
        {/* TODO set audio source based on user selection of podcast episode */}
        <AudioPlayer source="" />
      </div>
      <Outlet />
    </>
  )
}
