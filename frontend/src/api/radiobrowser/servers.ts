// Hard coded servers as requests to "http" fails with "This request has been blocked; the content must be served over HTTPS"
// http://all.api.radio-browser.info/json/servers
const servers: string[] = [
  "https://nl1.api.radio-browser.info",
  "https://de1.api.radio-browser.info",
  "https://at1.api.radio-browser.info",
]
const serverCount = servers.length

async function getRandomServer(): Promise<string> {
  const randomIndex = Math.floor(Math.random() * (serverCount - 1))
  return servers[randomIndex]
}

export { getRandomServer }
