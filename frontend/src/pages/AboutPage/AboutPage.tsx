import "./AboutPage.css"
import { useEffect } from "react"
import { IconType } from "react-icons/lib"
import { FaStickyNote } from "react-icons/fa"
import { FaHeadphonesSimple, FaStar, FaUsersViewfinder } from "react-icons/fa6"

const ICON_SIZE = 42

export default function AboutPage() {
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
    </div>
  )
}

function AboutSectionCard({ text, Icon }: { text: string; Icon: IconType }) {
  return (
    <div className="about-section-card">
      <Icon size={ICON_SIZE} />
      <p>{text}</p>
    </div>
  )
}
