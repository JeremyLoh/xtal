import "./GenreSelect.css"
import { genres } from "../../../../api/radiobrowser/genreTags"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6"
import { useRef } from "react"

function GenreSelect() {
  const sliderRef = useRef<HTMLDivElement | null>(null)
  function slideRight() {
    if (sliderRef.current == null) {
      return
    }
    const position = sliderRef.current.scrollLeft
    sliderRef.current.scroll({ left: position + 500, behavior: "smooth" })
  }
  return (
    <div id="genre-select-container">
      <FaChevronLeft size={60} className="icon slide-left-icon" />
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
