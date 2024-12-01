import ThemeToggle from "../ThemeToggle/ThemeToggle"
import "./Header.css"

function Header() {
  return (
    <header>
      <p className="header-app-name">Xtal</p>
      <div className="header-info">
        <p>Listen to the World</p>
        <ThemeToggle />
      </div>
    </header>
  )
}

export default Header
