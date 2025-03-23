import "./TrendingPodcastFilters.css"
import { memo, useCallback, useState } from "react"

type TrendingPodcastFiltersProps = {
  onChange: ({ since }: { since: number }) => Promise<void>
}

export default memo(function TrendingPodcastFilters({
  onChange,
}: TrendingPodcastFiltersProps) {
  const [sinceDays, setSinceDays] = useState(3)
  const handleSinceChange = useCallback(
    async (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newSinceDays = Number.parseInt(event.target.value)
      setSinceDays(newSinceDays)
      await onChange({ since: newSinceDays })
    },
    [onChange]
  )

  return (
    <>
      <label>
        Since
        <select
          className="podcast-trending-since-select"
          name="podcast-trending-since"
          defaultValue={sinceDays}
          onChange={handleSinceChange}
        >
          <option value="1">Last 24 hours</option>
          <option value="3">Last 72 hours</option>
          <option value="7">Last Week</option>
        </select>
      </label>
    </>
  )
})
