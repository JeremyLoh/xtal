import "./AboutPage.css"
import jeremyProfilePicture from "./jeremy-profile-picture.webp"
import { useEffect } from "react"
import { IconType } from "react-icons/lib"
import { FaStickyNote } from "react-icons/fa"
import { FaHeadphonesSimple, FaStar, FaUsersViewfinder } from "react-icons/fa6"
import Separator from "../../components/Separator/Separator.tsx"
import useScreenDimensions from "../../hooks/useScreenDimensions.ts"

export default function AboutPage() {
  const { width } = useScreenDimensions()
  const profilePictureSize = Math.min(width * 0.7, 500)

  useEffect(() => {
    document.title = "xtal - about"
  }, [])

  return (
    <div className="about-page-container">
      <h2>
        Immerse yourself in the world by exploring podcasts and radio stations
        from around the world using xtal!
      </h2>

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
