import { createContext, useCallback, useEffect, useMemo, useState } from "react"
import useLocalStorage from "../../hooks/useLocalStorage.ts"

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
  const { getItem: getStorageTheme, setItem: setStorageTheme } =
    useLocalStorage("THEME")
  const [isDark, setIsDark] = useState<boolean>(getStorageTheme() === darkTheme)

  const applyTheme = useCallback((theme: string) => {
    const root = document.getElementsByTagName("html")[0]
    root.className = theme
  }, [])

  const toggle = useCallback(() => {
    const theme = isDark ? lightTheme : darkTheme
    applyTheme(theme)
    setStorageTheme(theme)
    setIsDark(!isDark)
  }, [applyTheme, setStorageTheme, isDark])

  useEffect(() => {
    // set starting theme based on user preference
    const isDarkThemePreferred = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches
    setStorageTheme(isDarkThemePreferred ? darkTheme : lightTheme)
  }, [setStorageTheme])

  const output = useMemo(() => {
    return { isDark, toggle }
  }, [isDark, toggle])

  applyTheme(isDark ? darkTheme : lightTheme)

  return (
    <ThemeContext.Provider value={output}>{children}</ThemeContext.Provider>
  )
}

export default ThemeProvider
