import { useContext } from "react"
import { FaMoon, FaSun } from "react-icons/fa"
import "./ThemeToggle.css"
import { ThemeContext } from "../../context/ThemeProvider/ThemeProvider"

function ThemeToggle() {
  const theme = useContext(ThemeContext)
  return theme == undefined ? null : (
    <button
      onClick={() => theme.toggle()}
      className="theme-toggle-btn"
      data-testid="theme-toggle-btn"
      title="Toggle Theme"
    >
      {theme?.isDark ? (
        <FaMoon className="dark-mode-icon" size={24} />
      ) : (
        <FaSun className="light-mode-icon" size={24} />
      )}
    </button>
  )
}

export default ThemeToggle
