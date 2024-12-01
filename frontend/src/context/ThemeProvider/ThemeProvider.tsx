import { createContext, useState } from "react"

// https://www.realtimecolors.com/?colors=180c15-fdfafc-fdacca-9fcd9b-e45ac2&fonts=Ubuntu-Ubuntu
const lightTheme = [
  "--text-color: #180c15;",
  "--background-color: #fdfafc;",
  "--primary-color: #fdacca;",
  "--secondary-color: #9fcd9b;",
  "--accent-color: #e45ac2;",
  "--error-color: #a80b0b;",
  "--success-color: #0e5d3c;",
  "--link-color: #0b2881;",
  "--disabled-element-color: #737373;",
  "--genre-chip-primary-color: #d4d4d4;",
  "--genre-chip-secondary-color: #e5e5e5;",
  "--genre-chip-selected-color: #262626;",
  "--genre-chip-selected-text-color: #f5f5f5;",
]

// https://www.realtimecolors.com/?colors=e8ebf5-0b0f1d-4846b6-143fc0-3059d2&fonts=Ubuntu-Ubuntu
const darkTheme = [
  "--text-color: #e8ebf5;",
  "--background-color: #0b0f1d;",
  "--primary-color: #4846b6;",
  "--secondary-color: #143fc0;",
  "--accent-color: #3059d2;",
  "--error-color: #ff3535;",
  "--success-color: #22c55e;",
  "--link-color: #e6f0f7;",
  "--disabled-element-color: #737373;",
  "--genre-chip-primary-color: #525252;",
  "--genre-chip-secondary-color: #737373;",
  "--genre-chip-selected-color: #d4d4d4;",
  "--genre-chip-selected-text-color: #171717;",
]

type Theme = {
  isDark: boolean
  toggle: () => void
}
export const ThemeContext = createContext<Theme | undefined>(undefined)

// https://stackoverflow.com/questions/61117608/how-do-i-set-system-preference-dark-mode-in-a-react-app-but-also-allow-users-to
function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState<boolean>(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  )
  function applyTheme(theme: string[]) {
    const root = document.getElementsByTagName("html")[0]
    root.style.cssText = theme.join("")
  }
  function toggle() {
    const body = document.getElementsByTagName("body")[0]
    body.style.cssText = "transition: background 0.3s"
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
