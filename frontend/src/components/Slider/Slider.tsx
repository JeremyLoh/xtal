import "./Slider.css"
import { memo, PropsWithChildren, useCallback, useRef } from "react"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6"

type SliderProps = PropsWithChildren & {
  scrollAmount: number
  className?: string
}

function Slider({ children, scrollAmount, className }: SliderProps) {
  const sliderRef = useRef<HTMLDivElement | null>(null)

  const slideLeft = useCallback(() => {
    if (sliderRef.current == null) {
      return
    }
    const nextPosition = sliderRef.current.scrollLeft - scrollAmount
    sliderRef.current.scroll({ left: nextPosition, behavior: "smooth" })
  }, [scrollAmount])

  const slideRight = useCallback(() => {
    if (sliderRef.current == null) {
      return
    }
    const nextPosition = sliderRef.current.scrollLeft + scrollAmount
    sliderRef.current.scroll({ left: nextPosition, behavior: "smooth" })
  }, [scrollAmount])

  return (
    <div className={`slider-container ${className ? className : ""}`}>
      <FaChevronLeft
        size={16}
        className="icon slide-left-icon"
        onClick={slideLeft}
      />
      <div ref={sliderRef} className="slider">
        {children}
      </div>
      <FaChevronRight
        size={16}
        className="icon slide-right-icon"
        onClick={slideRight}
      />
    </div>
  )
}

export default memo(Slider)
