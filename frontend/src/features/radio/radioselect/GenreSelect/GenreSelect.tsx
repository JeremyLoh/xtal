import { memo, useState } from "react"
import Slider from "../../../../components/Slider/Slider.tsx"
import Button from "../../../../components/ui/button/Button.tsx"
import {
  DEFAULT_GENRE_SEARCH,
  GenreInformation,
  genres,
} from "../../../../api/radiobrowser/genreTags.ts"

type GenreSelectProps = {
  onGenreSelect: (genre: GenreInformation) => void
}

function GenreSelect(props: Readonly<GenreSelectProps>) {
  const SCROLL_AMOUNT = 500
  const [selectedGenre, setSelectedGenre] = useState<string>(
    DEFAULT_GENRE_SEARCH.genre
  )
  return (
    <Slider className="genre-slider-container" scrollAmount={SCROLL_AMOUNT}>
      {genres.map((genreInfo: GenreInformation, index: number) => (
        <Button
          key={`genre-slider-option-${genreInfo.genre}-${index}`}
          keyProp={`genre-slider-option-${genreInfo.genre}`}
          className={selectedGenre === genreInfo.genre ? "selected" : ""}
          onClick={() => {
            setSelectedGenre(genreInfo.genre)
            props.onGenreSelect(genreInfo)
          }}
        >
          {genreInfo.genre}
        </Button>
      ))}
    </Slider>
  )
}

export default memo(GenreSelect)
