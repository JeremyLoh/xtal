import "./Header.css"
import { Link } from "react-router"
import ThemeProvider from "../../context/ThemeProvider/ThemeProvider.tsx"
import FavouriteStationToggle from "../../features/favourite/FavouriteStationToggle/FavouriteStationToggle.tsx"
import ThemeToggle from "../ThemeToggle/ThemeToggle.tsx"

function Header() {
  return (
    <div id="header-container">
      <header>
        <p className="header-title">Xtal</p>
        <nav className="header-navbar">
          <ul>
            <li>
              <Link to="/" className="header-navbar-radio-link">
                Radio
              </Link>
            </li>
            <li>
              <Link to="/podcasts" className="header-navbar-podcast-link">
                Podcast
              </Link>
            </li>
          </ul>
        </nav>
        <div className="header-actions">
          <ThemeProvider>
            <ThemeToggle />
          </ThemeProvider>
          <FavouriteStationToggle />
        </div>
      </header>
    </div>
  )
}

export default Header
