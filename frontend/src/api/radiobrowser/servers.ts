// Hard coded servers as requests to "http" fails with "This request has been blocked; the content must be served over HTTPS"
// http://all.api.radio-browser.info/json/servers
// Need to update vite.config.ts csp plugin 'connect-src' with list of servers
const servers: string[] = [
  "https://de2.api.radio-browser.info",
  "https://fi1.api.radio-browser.info",
]
const serverCount = servers.length

async function getRandomServer(): Promise<string> {
  const randomIndex: number = Math.floor(Math.random() * (serverCount - 1))
  const server = servers.at(randomIndex)
  if (server == undefined) {
    throw new Error("Could not get server url")
  }
  return server
}

export { getRandomServer }
