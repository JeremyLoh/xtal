import { memo, useState } from "react"
import {
  CountryStation,
  countryStationInfo,
  DEFAULT_COUNTRY_SEARCH,
} from "../../../../api/location/countryStation.ts"
import Slider from "../../../../components/Slider/Slider.tsx"
import Button from "../../../../components/ui/button/Button.tsx"

type CountrySelectProps = {
  onCountrySelect: (country: CountryStation) => void
}

function CountrySelect({ onCountrySelect }: CountrySelectProps) {
  const SCROLL_AMOUNT = 500
  const [selectedCountry, setSelectedCountry] = useState<string>(
    DEFAULT_COUNTRY_SEARCH.name
  )
  return (
    <Slider scrollAmount={SCROLL_AMOUNT}>
      {countryStationInfo.map((country: CountryStation) => (
        <div key={country.countryCode}>
          <Button
            className={`country-slider-option ${
              selectedCountry === country.name ? "selected" : ""
            }`}
            onClick={() => {
              setSelectedCountry(country.name)
              onCountrySelect(country)
            }}
          >
            {country.name}
          </Button>
        </div>
      ))}
    </Slider>
  )
}

export default memo(CountrySelect)
