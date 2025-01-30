import crypto from "node:crypto"
import DateUtil from "./dateUtil.js"

type AuthManager = {
  getAuthTokenHeaders(): Headers
}

class PodcastIndexAuthManager implements AuthManager {
  // https://podcastindex-org.github.io/docs-api/#overview--authentication-details
  private apiKey: string
  private apiSecret: string

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

export { AuthManager, PodcastIndexAuthManager }
