import { AccountPodcastEpisodePlayHistory } from "./model/account.ts"

type AccountPodcastEpisodePlayHistoryResponse = {
  count: number
  data: AccountPodcastEpisodePlayHistory[] | null
}

export type { AccountPodcastEpisodePlayHistoryResponse }
