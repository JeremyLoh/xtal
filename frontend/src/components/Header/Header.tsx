import "./Header.css"
import { memo } from "react"
import { Link } from "react-router"
import Wave from "react-wavify"
import ThemeProvider from "../../context/ThemeProvider/ThemeProvider.tsx"
import ThemeToggle from "../ThemeToggle/ThemeToggle.tsx"
import SidebarToggle from "../SidebarToggle/SidebarToggle.tsx"
import useScreenDimensions from "../../hooks/useScreenDimensions.ts"
import { homePage, podcastHomePage } from "../../paths.ts"

const waveStyle = { display: "flex", height: 16 }
const waveOptions = {
  height: 10,
  amplitude: 10,
  speed: 0.2,
  points: 3,
}

function Header() {
  const { isMobile } = useScreenDimensions()
  return (
    <div id="header-container">
      <header>
        <p className="header-title">Xtal</p>
        {!isMobile && (
          <nav className="header-navbar">
            <ul>
              <li>
                <Link to={homePage()} className="header-navbar-radio-link">
                  Radio
                </Link>
              </li>
              <li>
                <Link
                  to={podcastHomePage()}
                  className="header-navbar-podcast-link"
                >
                  Podcast
                </Link>
              </li>
            </ul>
          </nav>
        )}
        <div className="header-actions">
          <ThemeProvider>
            <ThemeToggle />
          </ThemeProvider>
          <SidebarToggle />
        </div>
      </header>
      <Wave
        fill="var(--accent-color)"
        paused={false}
        style={waveStyle}
        options={waveOptions}
      />
    </div>
  )
}

export default memo(Header)
