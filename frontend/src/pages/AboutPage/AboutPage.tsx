import "./AboutPage.css"
import { useEffect } from "react"
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
        <div className="about-section-card">
          <FaStar size={ICON_SIZE} />
          <p>Discover new interests across a large variety of categories</p>
        </div>
        <div className="about-section-card">
          <FaStickyNote size={ICON_SIZE} />
          <p>Obtain expert insights and learn on the go</p>
        </div>
        <div className="about-section-card">
          <FaHeadphonesSimple size={ICON_SIZE} />
          <p>Practice your active listening skills</p>
        </div>
        <div className="about-section-card">
          <FaUsersViewfinder size={ICON_SIZE} />
          <p>Experience different cultures and perspectives</p>
        </div>
      </div>
    </div>
  )
}
