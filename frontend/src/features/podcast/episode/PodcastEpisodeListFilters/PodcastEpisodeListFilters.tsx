import "./PodcastEpisodeListFilters.css"
import { memo, useCallback, useState } from "react"

type PodcastEpisodeListFiltersType = {
  durationInMinutes?: number
}

type PodcastEpisodeListFiltersProps = {
  filters: PodcastEpisodeListFiltersType
  onChange: ({ durationInMinutes }: PodcastEpisodeListFiltersType) => void
}

function PodcastEpisodeListFilters({
  filters,
  onChange,
}: Readonly<PodcastEpisodeListFiltersProps>) {
  const [duration, setDuration] = useState<number>(
    filters.durationInMinutes || 0
  )

  const handleDurationChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const durationInMinutes = Number.parseInt(event.target.value)
      if (durationInMinutes === 0) {
        // remove filter by duration (show "All" option)
        onChange({ durationInMinutes: undefined })
        setDuration(0)
      } else {
        onChange({ durationInMinutes })
        setDuration(durationInMinutes)
      }
    },
    [onChange]
  )

  return (
    <div className="podcast-episode-list-filters">
      <label>
        <select
          name="podcast-episode-duration-filter"
          className="podcast-episode-duration-filter"
          onChange={handleDurationChange}
          defaultValue={duration}
        >
          <option value="0">All Durations</option>
          <option value="120">Duration ≤ 120 minutes</option>
          <option value="90">Duration ≤ 90 minutes</option>
          <option value="60">Duration ≤ 60 minutes</option>
          <option value="50">Duration ≤ 50 minutes</option>
          <option value="40">Duration ≤ 40 minutes</option>
          <option value="30">Duration ≤ 30 minutes</option>
          <option value="20">Duration ≤ 20 minutes</option>
          <option value="10">Duration ≤ 10 minutes</option>
          <option value="5">Duration ≤ 5 minutes</option>
        </select>
      </label>
    </div>
  )
}

export default memo(PodcastEpisodeListFilters)
export type { PodcastEpisodeListFiltersType }
