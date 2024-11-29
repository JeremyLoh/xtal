import "./GenreSelect.css"
import { genres } from "../../../../api/radiobrowser/genreTags"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6"
import { useRef } from "react"

function GenreSelect() {
  const SCROLL_AMOUNT = 500
  const sliderRef = useRef<HTMLDivElement | null>(null)
  function slideLeft() {
    if (sliderRef.current == null) {
      return
    }
    const nextPosition = sliderRef.current.scrollLeft - SCROLL_AMOUNT
    sliderRef.current.scroll({ left: nextPosition, behavior: "smooth" })
  }
  function slideRight() {
    if (sliderRef.current == null) {
      return
    }
    const nextPosition = sliderRef.current.scrollLeft + SCROLL_AMOUNT
    sliderRef.current.scroll({ left: nextPosition, behavior: "smooth" })
  }
  return (
    <div id="genre-select-container">
      <FaChevronLeft
        size={60}
        className="icon slide-left-icon"
        onClick={slideLeft}
      />
      <div ref={sliderRef} className="slider">
        {genres.map((genreInfo) => (
          <div key={genreInfo.genre}>
            <button>{genreInfo.genre}</button>
          </div>
        ))}
      </div>
      <FaChevronRight
        size={60}
        className="icon slide-right-icon"
        onClick={slideRight}
      />
    </div>
  )
}

export default GenreSelect
