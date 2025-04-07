import supertokens from "supertokens-node"
import Session from "supertokens-node/recipe/session"
import EmailPassword from "supertokens-node/recipe/emailpassword"

function initializeSupertokensSdk() {
  supertokens.init({
    framework: "express",
    supertokens: {
      // We use try.supertokens for demo purposes.
      // At the end of the tutorial we will show you how to create
      // your own SuperTokens core instance and then update your config
      connectionURI: "https://try.supertokens.io",
      // apiKey: <YOUR_API_KEY>
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
