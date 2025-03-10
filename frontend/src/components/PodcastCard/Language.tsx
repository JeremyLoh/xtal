import { usePodcastCardContext } from "./PodcastCardContext.ts"
import Pill from "../Pill/Pill.tsx"

const Language = function PodcastCardLanguage() {
  const { podcast } = usePodcastCardContext()
  return podcast.language && <Pill>{podcast.language}</Pill>
}

export default Language
