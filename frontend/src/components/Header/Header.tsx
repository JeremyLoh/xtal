import FavouriteStationToggle from "../../features/favourite/FavouriteStationToggle/FavouriteStationToggle"
import ThemeToggle from "../ThemeToggle/ThemeToggle"
import "./Header.css"

function Header() {
  return (
    <div id="header-container">
      <header>
        <div className="header-title-container">
          <p className="header-title">Xtal</p>
          <p className="header-subtitle">Listen to the World</p>
        </div>
        <div className="header-actions">
          <ThemeToggle />
          <FavouriteStationToggle />
        </div>
      </header>
    </div>
  )
}

export default Header
