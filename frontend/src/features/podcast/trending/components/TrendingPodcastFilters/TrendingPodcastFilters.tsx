import { useState } from "react"

type TrendingPodcastFiltersProps = {
  onChange: ({ since }: { since: number }) => Promise<void>
}

export default function TrendingPodcastFilters(
  props: TrendingPodcastFiltersProps
) {
  const [sinceDays, setSinceDays] = useState(3)
  async function handleSinceChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    const newSinceDays = Number.parseInt(event.target.value)
    setSinceDays(newSinceDays)
    await props.onChange({ since: newSinceDays })
  }

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
}
