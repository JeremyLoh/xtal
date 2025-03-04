import "./SearchBar.css"
import { memo, useCallback, useEffect, useState } from "react"
import { TbSearch } from "react-icons/tb"
import useDebounce from "../../hooks/useDebounce.ts"

type SearchBarProps = {
  onChange: (search: string) => Promise<void>
  placeholder?: string
  className?: string
}

export default memo(function SearchBar({
  onChange,
  className,
  placeholder,
}: SearchBarProps) {
  const [search, setSearch] = useState<string>("")
  const debouncedSearch = useDebounce<string>(search)

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value)
    },
    []
  )

  useEffect(() => {
    onChange(debouncedSearch)
    setSearch(debouncedSearch)
  }, [onChange, debouncedSearch])

  return (
    <div className={`search-bar-container ${className}`}>
      <TbSearch size={24} />
      <input
        className="search-input"
        value={search}
        title={placeholder}
        placeholder={placeholder}
        onChange={handleInputChange}
      />
    </div>
  )
})
