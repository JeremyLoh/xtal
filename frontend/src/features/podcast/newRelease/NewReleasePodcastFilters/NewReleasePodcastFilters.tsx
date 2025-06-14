import "./NewReleasePodcastFilters.css"
import { useCallback, useState } from "react"
import { RECENT_PODCAST_LANGUAGES } from "../../../../api/podcast/model/podcastRecent.ts"

const DEFAULT_SELECTED_LANGUAGE = "all"
const DISABLED_DURATION_IN_MS = 600 // rate limit user calls to change filter

type NewReleasePodcastFilterProps = {
  availableLanguages: [string, RECENT_PODCAST_LANGUAGES][]
  onFilterChange: (filters?: { language: string }) => Promise<void>
}

function NewReleasePodcastFilters({
  availableLanguages,
  onFilterChange,
}: NewReleasePodcastFilterProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    DEFAULT_SELECTED_LANGUAGE
  )
  const [disabled, setDisabled] = useState<boolean>(false)

  const handleLanguageChange = useCallback(
    async (event: React.ChangeEvent<HTMLSelectElement>) => {
      const language = event.target.value
      setSelectedLanguage(language)
      setDisabled(true)
      setTimeout(() => {
        setDisabled(false)
      }, DISABLED_DURATION_IN_MS)

      if (language === DEFAULT_SELECTED_LANGUAGE) {
        await onFilterChange()
      } else {
        await onFilterChange({ language })
      }
    },
    [onFilterChange]
  )

  return (
    <select
      className="new-release-podcast-language-filter"
      value={selectedLanguage}
      disabled={disabled}
      onChange={handleLanguageChange}
      aria-label="Filter New Releases by language"
      data-testid="new-release-podcast-language-filter"
    >
      <option value={DEFAULT_SELECTED_LANGUAGE}>All Languages</option>
      {availableLanguages.map(([languageCodeIso639, languageFullName]) => {
        return (
          <option
            key={`new-release-filter-language-${languageCodeIso639}`}
            value={languageCodeIso639}
          >
            {languageFullName}
          </option>
        )
      })}
    </select>
  )
}

export default NewReleasePodcastFilters
