import crypto from "node:crypto"
import DateUtil from "./dateUtil.js"
import { InvalidApiKeyError } from "../error/invalidApiKeyError.js"

type AuthManager = {
  getAuthTokenHeaders(): Headers
}

class PodcastIndexAuthManager implements AuthManager {
  // https://podcastindex-org.github.io/docs-api/#overview--authentication-details
  private readonly apiKey: string
  private readonly apiSecret: string

  constructor(apiKey: string, apiSecret: string) {
    this.apiKey = apiKey
    this.apiSecret = apiSecret
  }

  getAuthTokenHeaders(): Headers {
    const apiHeaderTime = DateUtil.getUnixTimestamp(new Date())
    const headers = new Headers({
      Authorization: this.getAuthHash(apiHeaderTime),
      "User-Agent": "xtal/1.0",
      "X-Auth-Key": this.apiKey,
      "X-Auth-Date": "" + apiHeaderTime,
    })
    return headers
  }

  private getAuthHash(apiHeaderTime: string): string {
    const data = this.apiKey + this.apiSecret + apiHeaderTime
    const sha1Hash = crypto.createHash("sha1")
    sha1Hash.update(data)
    return sha1Hash.digest("hex")
  }
}

function getPodcastIndexAuthManager() {
  const apiKey = process.env.PODCAST_INDEX_API_KEY
  const apiSecret = process.env.PODCAST_INDEX_API_SECRET
  if (
    apiKey == null ||
    apiKey === "" ||
    apiSecret == null ||
    apiSecret === ""
  ) {
    throw new InvalidApiKeyError(
      "Server configuration error: Invalid Podcast API Key"
    )
  }
  const podcastAuthManager = new PodcastIndexAuthManager(apiKey, apiSecret)
  return podcastAuthManager
}

export { AuthManager, PodcastIndexAuthManager, getPodcastIndexAuthManager }
