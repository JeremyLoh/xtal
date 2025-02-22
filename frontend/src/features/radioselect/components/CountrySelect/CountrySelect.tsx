import { useState } from "react"
import {
  CountryStation,
  countryStationInfo,
  DEFAULT_COUNTRY_SEARCH,
} from "../../../../api/location/countryStation.ts"
import Slider from "../../../../components/Slider/Slider.tsx"

type CountrySelectProps = {
  handleCountrySelect: (country: CountryStation) => void
}

function CountrySelect(props: CountrySelectProps) {
  const SCROLL_AMOUNT = 500
  const [selectedCountry, setSelectedCountry] = useState<string>(
    DEFAULT_COUNTRY_SEARCH.name
  )
  return (
    <Slider scrollAmount={SCROLL_AMOUNT}>
      {countryStationInfo.map((country: CountryStation) => (
        <div key={country.countryCode}>
          <button
            className={`country-slider-option ${
              selectedCountry === country.name ? "selected" : ""
            }`}
            onClick={() => {
              setSelectedCountry(country.name)
              props.handleCountrySelect(country)
            }}
          >
            {country.name}
          </button>
        </div>
      ))}
    </Slider>
  )
}

export default CountrySelect
