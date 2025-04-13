import SuperTokens from "supertokens-auth-react"
import EmailPassword from "supertokens-auth-react/recipe/emailpassword"
import EmailVerification from "supertokens-auth-react/recipe/emailverification"
import Session from "supertokens-auth-react/recipe/session"
import { getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react/ui"
import { EmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/emailpassword/prebuiltui"
import { EmailVerificationPreBuiltUI } from "supertokens-auth-react/recipe/emailverification/prebuiltui"
import * as reactRouterDom from "react-router" // note: causes larger bundle size
import { getEnv } from "../env/environmentVariables.ts"

const { BACKEND_ORIGIN, FRONTEND_ORIGIN } = getEnv()

function initializeSuperTokens() {
  SuperTokens.init({
    appInfo: {
      // https://supertokens.com/docs/references/frontend-sdks/reference#sdk-configuration
      appName: "xtal",
      apiDomain: BACKEND_ORIGIN, // backend endpoint that frontend calls
      websiteDomain: FRONTEND_ORIGIN, // frontend domain where login ui appears
      apiBasePath: "/auth",
      websiteBasePath: "/auth",
    },
    recipeList: [
      EmailVerification.init({ mode: "REQUIRED" }),
      EmailPassword.init(),
      Session.init(),
    ],
  })
}

function getSuperTokensRoutes() {
  return getSuperTokensRoutesForReactRouterDom(reactRouterDom, [
    EmailPasswordPreBuiltUI,
    EmailVerificationPreBuiltUI,
  ])
}

export { initializeSuperTokens, getSuperTokensRoutes }
