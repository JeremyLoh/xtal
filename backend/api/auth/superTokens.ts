import supertokens from "supertokens-node"
import Session from "supertokens-node/recipe/session"
import EmailPassword from "supertokens-node/recipe/emailpassword"

function initializeSupertokensSdk() {
  supertokens.init({
    framework: "express",
    supertokens: {
      // supertokens core managed instance - https://supertokens.com
      connectionURI:
        process.env.SUPERTOKENS_CONNECTION_URI ||
        "TODO: MISSING SUPERTOKENS_CONNECTION_URI",
      apiKey:
        process.env.SUPERTOKENS_API_KEY || "TODO: MISSING SUPERTOKENS_API_KEY",
    },
    appInfo: {
      // https://supertokens.com/docs/session/appinfo
      appName: "xtal",
      apiDomain: process.env.BACKEND_ORIGIN || "TODO: MISSING BACKEND_ORIGIN",
      websiteDomain: process.env.FRONTEND_ORIGIN,
      apiBasePath: "/auth",
      websiteBasePath: "/auth",
    },
    recipeList: [
      EmailPassword.init(), // initialize sign in / sign up features
      Session.init(), // initialize session features
    ],
  })
}

export { initializeSupertokensSdk }
