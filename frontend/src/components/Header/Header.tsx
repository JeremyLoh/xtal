import FavouriteStationToggle from "../../features/favourite/FavouriteStationToggle/FavouriteStationToggle"
import ThemeToggle from "../ThemeToggle/ThemeToggle"
import "./Header.css"

function Header() {
  return (
    <div id="header-container">
      <header>
        <p className="header-app-name">Xtal</p>
        <div className="header-info">
          <p>Listen to the World</p>
          <ThemeToggle />
          <FavouriteStationToggle />
        </div>
      </header>
    </div>
  )
}

export default Header
