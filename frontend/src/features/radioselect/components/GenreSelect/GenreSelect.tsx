import { useState } from "react"
import Slider from "../../../../components/Slider/Slider.tsx"
import {
  DEFAULT_GENRE_SEARCH,
  GenreInformation,
  genres,
} from "../../../../api/radiobrowser/genreTags.ts"

type GenreSelectProps = {
  onGenreSelect: (genre: GenreInformation) => void
}

function GenreSelect(props: GenreSelectProps) {
  const SCROLL_AMOUNT = 500
  const [selectedGenre, setSelectedGenre] = useState<string>(
    DEFAULT_GENRE_SEARCH.genre
  )
  return (
    <Slider className="genre-slider-container" scrollAmount={SCROLL_AMOUNT}>
      {genres.map((genreInfo: GenreInformation) => (
        <div key={genreInfo.genre}>
          <button
            className={selectedGenre === genreInfo.genre ? "selected" : ""}
            onClick={() => {
              setSelectedGenre(genreInfo.genre)
              props.onGenreSelect(genreInfo)
            }}
          >
            {genreInfo.genre}
          </button>
        </div>
      ))}
    </Slider>
  )
}

export default GenreSelect
