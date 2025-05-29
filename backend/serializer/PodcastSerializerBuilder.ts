import { Podcast } from "../model/podcast.js"

class PodcastSerializerBuilder {
  private podcasts: Podcast[] | null = null
  private excludeFields: Set<keyof Podcast> = new Set()

  public setPodcasts(podcasts: Podcast[]): this {
    this.podcasts = podcasts
    return this
  }

  public exclude(fields: (keyof Podcast)[]): this {
    fields.forEach((f) => this.excludeFields.add(f))
    return this
  }

  private serializeOne(podcast: Podcast): Partial<Podcast> {
    const output: Partial<Podcast> = {}
    for (const key of Object.keys(podcast)) {
      const podcastKey = key as keyof Podcast
      if (this.excludeFields.has(podcastKey)) {
        continue
      }
      const value = podcast[podcastKey]
      if (value != undefined) {
        // @ts-ignore
        output[podcastKey] = value
      }
    }
    return output
  }

  public build(): Partial<Podcast>[] {
    if (this.podcasts) {
      return this.podcasts.map((p) => this.serializeOne(p))
    }
    throw new Error(
      "No podcasts provided to serialize in PodcastSerializerBuilder"
    )
  }
}

export default PodcastSerializerBuilder
