import "./FavouriteStationFilters.css"
import { memo, useCallback, useEffect, useState } from "react"
import useDebounce from "../../../hooks/useDebounce.ts"

type CountryInfo = {
  name: string
  countryCode: string // ISO 3166 2 letter country code (e.g. "US")
}

type FavouriteStationFiltersProps = {
  onChange: ({
    name,
    countryCode,
  }: {
    name: string
    countryCode: string
  }) => void
  countries: CountryInfo[]
}

export default memo(function FavouriteStationFilters({
  onChange,
  countries,
}: FavouriteStationFiltersProps) {
  const [countryCode, setCountryCode] = useState<string>("")
  const [name, setName] = useState<string>("")
  const debouncedName = useDebounce<string>(name, 400)

  const handleNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const name = event.target.value
      setName(name)
    },
    []
  )

  const handleCountrySelect = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const countryCode = event.target.value
      setCountryCode(countryCode)
      onChange({ name: debouncedName, countryCode: countryCode })
    },
    [onChange, debouncedName]
  )

  useEffect(() => {
    onChange({ name: debouncedName, countryCode: countryCode })
    setName(debouncedName)
  }, [onChange, debouncedName, countryCode])

  return (
    <div className="favourite-station-filter-container">
      <h3 className="favourite-station-filter-title">Filters</h3>
      <div className="favourite-station-filter">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={handleNameChange}
        />
      </div>
      <div className="favourite-station-filter">
        <label htmlFor="Country">Country</label>
        <select id="Country" value={countryCode} onChange={handleCountrySelect}>
          <option value="">Any</option>
          {countries.map(({ name, countryCode }) => (
            <option key={countryCode} value={countryCode}>
              {name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
})
