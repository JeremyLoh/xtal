import { useEffect, useMemo, useState } from "react"

type ScreenSize = {
  width: number
  height: number
}

function getScreenSize() {
  const { innerWidth, innerHeight } = window
  return {
    width: innerWidth,
    height: innerHeight,
  }
}

export default function useScreenDimensions() {
  // https://stackoverflow.com/a/36862446
  const [screenSize, setScreenSize] = useState<ScreenSize>(getScreenSize())
  useEffect(() => {
    function handleResize() {
      setScreenSize(getScreenSize())
    }
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const output = useMemo(() => {
    return {
      width: screenSize.width,
      height: screenSize.height,
      isMobile: screenSize.width <= 576,
    }
  }, [screenSize.width, screenSize.height])

  return output
}
