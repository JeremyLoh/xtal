import { Transcript } from "../api/model/podcastEpisode.js"
import { Language } from "./podcast.js"

type Person = {
  // represent a person of interest (e.g. hosts, co-hosts, guests) - https://github.com/Podcastindex-org/podcast-namespace/blob/main/docs/1.0.md#person
  id: number // internal PodcastIndex.org person id
  name: string
  role: string // value should be the "role" in https://github.com/Podcastindex-org/podcast-namespace/blob/main/taxonomy.json
  group: string // value should be the "group" in https://github.com/Podcastindex-org/podcast-namespace/blob/main/taxonomy.json
  href: string // URL related to information about the person (e.g. homepage)
  img: string // picture / avatar of person
}

export type PodcastEpisode = {
  id: number
  feedId: number
  feedUrl?: string
  title: string
  feedTitle?: string
  description: string
  contentUrl: string // url link to episode file
  contentType: string // Content-Type of the episode file (e.g. mp3 => "audio\/mpeg")
  durationInSeconds: number | null
  datePublished: number // unix epoch time in seconds
  isExplicit: boolean
  episodeNumber: number | null
  seasonNumber: number | null
  image: string
  language: Language
  people: Person[] | null
  externalWebsiteUrl: string
  transcripts: Transcript[] | null
}
