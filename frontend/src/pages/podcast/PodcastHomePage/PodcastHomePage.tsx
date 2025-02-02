import { useEffect } from "react"

export default function PodcastHomePage() {
  useEffect(() => {
    document.title = "xtal - podcasts"
  }, [])

  return <>Podcast Home Page</>
}
