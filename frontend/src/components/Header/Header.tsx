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
        </div>
      </header>
    </div>
  )
}

export default Header
