import "./ThemeToggle.css"
import { useCallback, useContext } from "react"
import { FaMoon, FaSun } from "react-icons/fa"
import { ThemeContext } from "../../context/ThemeProvider/ThemeProvider.tsx"
import Button from "../ui/button/Button.tsx"

function ThemeToggle() {
  const theme = useContext(ThemeContext)
  const handleClick = useCallback(() => {
    if (theme) {
      theme.toggle()
    }
  }, [theme])

  return theme == undefined ? null : (
    <Button
      onClick={handleClick}
      className="theme-toggle-button"
      data-testid="theme-toggle-button"
      title="Toggle Theme"
    >
      {theme.isDark ? (
        <FaMoon className="dark-mode-icon" size={24} />
      ) : (
        <FaSun className="light-mode-icon" size={24} />
      )}
    </Button>
  )
}

export default ThemeToggle
