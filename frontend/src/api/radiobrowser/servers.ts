import ky from "ky"

type Server = {
  ip: string
  name: string
}

async function getServers(): Promise<String[]> {
  const endpoint = "http://all.api.radio-browser.info/json/servers"
  const json: Server[] = await ky.get(endpoint, { retry: 0 }).json()
  return [...new Set(json.map((data) => "https://" + data.name))]
}

export { getServers }
