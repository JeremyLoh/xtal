import "./FavouriteStationFilters.css"
import { memo, useCallback, useEffect, useState } from "react"
import useDebounce from "../../../hooks/useDebounce.ts"

type FavouriteStationFiltersProps = {
  onChange: ({ name }: { name: string }) => void
}

export default memo(function FavouriteStationFilters({
  onChange,
}: FavouriteStationFiltersProps) {
  const [name, setName] = useState<string>("")
  const debouncedName = useDebounce<string>(name, 400)

  const handleNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const name = event.target.value
      setName(name)
    },
    []
  )

  useEffect(() => {
    onChange({ name: debouncedName })
    setName(debouncedName)
  }, [onChange, debouncedName])

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
    </div>
  )
})
