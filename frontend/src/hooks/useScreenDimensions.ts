import { useEffect, useMemo, useState } from "react"

type ScreenSize = {
  width: number
  height: number
  devicePixelRatio: number
}

function getScreenSize() {
  const { innerWidth, innerHeight, devicePixelRatio } = window
  return {
    width: innerWidth,
    height: innerHeight,
    devicePixelRatio,
  }
}

const MIN_DEVICE_PIXEL_RATIO = 1

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
      devicePixelRatio: Math.max(
        MIN_DEVICE_PIXEL_RATIO,
        Math.round(screenSize.devicePixelRatio / 0.5) * 0.5 // round to nearest 0.5 multiple
      ),
      isMobile: screenSize.width <= 576,
    }
  }, [screenSize.width, screenSize.height])

  return output
}
