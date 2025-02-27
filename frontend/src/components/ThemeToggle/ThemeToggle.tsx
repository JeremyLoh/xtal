import "./ThemeToggle.css"
import { useContext } from "react"
import { FaMoon, FaSun } from "react-icons/fa"
import { ThemeContext } from "../../context/ThemeProvider/ThemeProvider.tsx"

function ThemeToggle() {
  const theme = useContext(ThemeContext)
  return theme == undefined ? null : (
    <button
      onClick={() => theme.toggle()}
      className="theme-toggle-button"
      data-testid="theme-toggle-button"
      title="Toggle Theme"
    >
      {theme.isDark ? (
        <FaMoon className="dark-mode-icon" size={24} />
      ) : (
        <FaSun className="light-mode-icon" size={24} />
      )}
    </button>
  )
}

export default ThemeToggle
