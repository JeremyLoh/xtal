import ky from "ky"

type Server = {
  ip: string
  name: string
}

async function getServers(): Promise<string[]> {
  const endpoint = "http://all.api.radio-browser.info/json/servers"
  const json: Server[] = await ky.get(endpoint, { retry: 0 }).json()
  return [...new Set(json.map((data) => "https://" + data.name))]
}

async function getRandomServer(): Promise<string> {
  const servers = await getServers()
  const size = servers.length
  const randomIndex = Math.floor(Math.random() * (size - 1))
  return servers[randomIndex]
}

export { getRandomServer }
