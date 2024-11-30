import "./GenreSelect.css"
import {
  DEFAULT_GENRE_SEARCH,
  GenreInformation,
  genres,
} from "../../../../api/radiobrowser/genreTags"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6"
import { useRef, useState } from "react"

type GenreSelectProps = {
  handleGenreSelect: (genre: GenreInformation) => void
}

function GenreSelect(props: GenreSelectProps) {
  const SCROLL_AMOUNT = 500
  const sliderRef = useRef<HTMLDivElement | null>(null)
  const [selectedGenre, setSelectedGenre] = useState<string>(
    DEFAULT_GENRE_SEARCH.genre
  )
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
        {genres.map((genreInfo: GenreInformation) => (
          <div key={genreInfo.genre}>
            <button
              className={selectedGenre === genreInfo.genre ? "selected" : ""}
              onClick={() => {
                setSelectedGenre(genreInfo.genre)
                props.handleGenreSelect(genreInfo)
              }}
            >
              {genreInfo.genre}
            </button>
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
