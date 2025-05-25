import "./AboutPage.css"
import jeremyProfilePicture from "./jeremy-profile-picture.webp"
import { useEffect, useState } from "react"
import { IconType } from "react-icons/lib"
import { FaStickyNote } from "react-icons/fa"
import { FaHeadphonesSimple, FaStar, FaUsersViewfinder } from "react-icons/fa6"
import LoadingDisplay from "../../components/LoadingDisplay/LoadingDisplay.tsx"
import Separator from "../../components/Separator/Separator.tsx"
import useScreenDimensions from "../../hooks/useScreenDimensions.ts"
import usePodcastStats, {
  CurrentPodcastStats,
} from "../../hooks/podcast/usePodcastStats.ts"

export default function AboutPage() {
  const { loading, fetchCurrentPodcastStats } = usePodcastStats()
  const [currentStats, setCurrentStats] = useState<CurrentPodcastStats | null>(
    null
  )
  const { width } = useScreenDimensions()
  const profilePictureSize = Math.min(width * 0.7, 500)

  useEffect(() => {
    document.title = "xtal - about"
  }, [])

  useEffect(() => {
    fetchCurrentPodcastStats().then((stats) => {
      if (stats) {
        setCurrentStats(stats)
      }
    })
  }, [fetchCurrentPodcastStats])

  return (
    <LoadingDisplay loading={loading}>
      <div className="about-page-container">
        <h2>
          Immerse yourself in the world by exploring podcasts and radio stations
          from around the world using xtal!
        </h2>

        {currentStats != null && (
          <div className="about-page-podcast-stats-container">
            <b>
              <span className="about-page-podcast-stats-figure">
                {currentStats.totalPodcasts.toLocaleString()}
              </span>{" "}
              Podcasts
            </b>
            <b>
              <span className="about-page-podcast-stats-figure">
                {currentStats.totalPodcastEpisodes.toLocaleString()}
              </span>{" "}
              Podcast Episodes
            </b>
            <b>
              <span className="about-page-podcast-stats-figure">
                {currentStats.episodesPublishedInLastThirtyDays.toLocaleString()}
              </span>{" "}
              New Podcast Episodes in Last 30 Days
            </b>
          </div>
        )}

        <h3>Why listen to podcasts/radio?</h3>
        <div className="about-section-container">
          <AboutSectionCard
            text="Discover new interests across a large variety of categories"
            Icon={FaStar}
          />
          <AboutSectionCard
            text="Obtain expert insights and learn on the go"
            Icon={FaStickyNote}
          />
          <AboutSectionCard
            text="Practice your active listening skills"
            Icon={FaHeadphonesSimple}
          />
          <AboutSectionCard
            text="Experience different cultures and perspectives"
            Icon={FaUsersViewfinder}
          />
        </div>
        <Separator />
        <div className="about-section-creator-container">
          <img
            data-testid="jeremy-profile-picture"
            className="jeremy-profile-picture"
            src={jeremyProfilePicture}
            alt="Profile Picture of Jeremy_Loh"
            width={profilePictureSize}
            height={profilePictureSize}
          />
          <div>
            <p className="jeremy-intro-title">
              👋 Hi, I'm <b>Jeremy Loh (@Jeremy_Loh)</b>
            </p>
            <p>
              I'm a Software Engineer who loves Photography. When I'm not
              programming, you can find me behind a camera!
            </p>
          </div>
        </div>
      </div>
    </LoadingDisplay>
  )
}

function AboutSectionCard({ text, Icon }: { text: string; Icon: IconType }) {
  const ICON_SIZE = 36
  return (
    <div className="about-section-card">
      <Icon size={ICON_SIZE} />
      <p>{text}</p>
    </div>
  )
}
