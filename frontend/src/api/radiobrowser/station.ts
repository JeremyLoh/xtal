import ky from "ky"
import { getRandomServer } from "./servers"
import { Station } from "./types"

async function getRandomStation(): Promise<Station> {
  const searchParams = new URLSearchParams(
    "?order=random&limit=1&hidebroken=true"
  )
  const server = await getRandomServer()
  const url = `${server}/json/stations`
  const json: Station[] = await ky.get(url, { retry: 0, searchParams }).json()
  return json[0]
}

export { getRandomStation }
