import "./Slider.css"
import { useRef } from "react"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6"

type SliderProps = {
  children: React.ReactNode
  scrollAmount: number
  className?: string
}

function Slider(props: SliderProps) {
  const sliderRef = useRef<HTMLDivElement | null>(null)
  function slideLeft() {
    if (sliderRef.current == null) {
      return
    }
    const nextPosition = sliderRef.current.scrollLeft - props.scrollAmount
    sliderRef.current.scroll({ left: nextPosition, behavior: "smooth" })
  }
  function slideRight() {
    if (sliderRef.current == null) {
      return
    }
    const nextPosition = sliderRef.current.scrollLeft + props.scrollAmount
    sliderRef.current.scroll({ left: nextPosition, behavior: "smooth" })
  }
  return (
    <div
      className={`slider-container ${props.className ? props.className : ""}`}
    >
      <FaChevronLeft
        size={60}
        className="icon slide-left-icon"
        onClick={slideLeft}
      />
      <div ref={sliderRef} className="slider">
        {props.children}
      </div>
      <FaChevronRight
        size={60}
        className="icon slide-right-icon"
        onClick={slideRight}
      />
    </div>
  )
}

export default Slider
