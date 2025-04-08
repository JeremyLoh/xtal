import supertokens from "supertokens-node"
import { getSupertokensConfig } from "./jwtConfig.js"

const supertokensCoreInfo = {
  // supertokens core managed instance - https://supertokens.com
  connectionURI:
    process.env.SUPERTOKENS_CONNECTION_URI ||
    "TODO: MISSING SUPERTOKENS_CONNECTION_URI",
  apiKey:
    process.env.SUPERTOKENS_API_KEY || "TODO: MISSING SUPERTOKENS_API_KEY",
}

function initializeSupertokensSdk() {
  supertokens.init(getSupertokensConfig())
}

export { initializeSupertokensSdk, supertokensCoreInfo }
