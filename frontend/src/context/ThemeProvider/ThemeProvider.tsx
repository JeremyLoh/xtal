import { createContext, useState } from "react"

const lightTheme = "light-theme"
const darkTheme = "dark-theme"

type Theme = {
  isDark: boolean
  toggle: () => void
}
// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext<Theme | undefined>(undefined)

// https://stackoverflow.com/questions/61117608/how-do-i-set-system-preference-dark-mode-in-a-react-app-but-also-allow-users-to
function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState<boolean>(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  )
  function applyTheme(theme: string) {
    const root = document.getElementsByTagName("html")[0]
    root.className = theme
  }
  function toggle() {
    const theme = isDark ? lightTheme : darkTheme
    applyTheme(theme)
    setIsDark(!isDark)
  }

  applyTheme(isDark ? darkTheme : lightTheme)
  return (
    <ThemeContext.Provider value={{ isDark, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider
