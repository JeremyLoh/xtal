import SuperTokens from "supertokens-auth-react"
import EmailPassword from "supertokens-auth-react/recipe/emailpassword"
import EmailVerification from "supertokens-auth-react/recipe/emailverification"
import Session from "supertokens-auth-react/recipe/session"
import { getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react/ui"
import { EmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/emailpassword/prebuiltui"
import { EmailVerificationPreBuiltUI } from "supertokens-auth-react/recipe/emailverification/prebuiltui"
import { getEnv } from "../env/environmentVariables.ts"

const { BACKEND_ORIGIN, FRONTEND_ORIGIN } = getEnv()

function initializeSuperTokens() {
  SuperTokens.init({
    enableDebugLogs: false,
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
      EmailPassword.init({
        signInAndUpFeature: {
          signUpForm: {
            formFields: [
              {
                id: "email",
                label: "Email",
                placeholder: "Email address",
                optional: false,
                validate: validateEmail,
              },
              {
                id: "username",
                label: "Username",
                placeholder: "Your unique username",
                optional: false,
                validate: validateUsername,
              },
              {
                id: "password",
                label: "Password",
                placeholder: "Password",
                optional: false,
              },
            ],
          },
        },
      }),
      Session.init(),
    ],
  })
}

async function getSuperTokensRoutes() {
  const reactRouterDom = await import("react-router")
  return getSuperTokensRoutesForReactRouterDom(reactRouterDom, [
    EmailPasswordPreBuiltUI,
    EmailVerificationPreBuiltUI,
  ])
}

async function validateEmail(email: string) {
  // needs to be identical between frontend and backend
  const values = email.split("@")
  if (values.length === 1 || values.length > 2 || values[0].trim() === "") {
    return "Invalid email"
  }
  const emailDomain = values[1]
  const { default: freeEmailDomains } = await import("free-email-domains")
  const isValidEmailProvided = freeEmailDomains.includes(emailDomain)
  if (isValidEmailProvided) {
    return undefined // no error
  }
  return "Invalid email"
}

async function validateUsername(username: string) {
  // needs to be identical between frontend and backend
  const containsWhitespaceRegex = new RegExp(/\s/)
  if (containsWhitespaceRegex.test(username)) {
    return "Invalid username. Whitespace is invalid"
  }
  if (username.length > 64) {
    return "Invalid username. Exceeded max length of 64 characters"
  }
  if (await containsProfanity(username)) {
    return "Invalid username. Profanity detected in username"
  }
  const containsInvalidCharactersRegex = new RegExp(/[:/%\\]/)
  if (containsInvalidCharactersRegex.test(username)) {
    return String.raw`Invalid username. The following characters are not allowed: ':', '/', '%', '\'`
  }
  return undefined
}

async function containsProfanity(text: string) {
  const { Profanity } = await import("@2toad/profanity")
  // needs to be identical between frontend and backend
  const profanity = new Profanity({
    wholeWord: true,
    languages: [
      "ar",
      "zh",
      "en",
      "fr",
      "de",
      "hi",
      "ja",
      "ko",
      "pt",
      "ru",
      "es",
    ],
  })
  return profanity.exists(text)
}

export { initializeSuperTokens, getSuperTokensRoutes }
