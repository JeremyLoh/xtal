import { Profanity } from "@2toad/profanity"
import freeEmailDomains from "free-email-domains"
import jwt from "jsonwebtoken"
import EmailPassword from "supertokens-node/recipe/emailpassword"
import EmailVerification from "supertokens-node/recipe/emailverification"
import SessionNode from "supertokens-node/recipe/session"
import {
  TypeInput,
  AppInfo,
  GeneralErrorResponse,
} from "supertokens-node/types"
import { supertokensCoreInfo } from "./superTokens.js"
import { getSupabase } from "../supabase/supabase.js"
import AccountClient from "../supabase/account/accountClient.js"
import logger from "../../logger.js"

const appInfo: AppInfo = {
  // https://supertokens.com/docs/session/appinfo
  appName: "xtal",
  apiDomain: process.env.BACKEND_ORIGIN || "TODO: MISSING BACKEND_ORIGIN",
  websiteDomain: process.env.FRONTEND_ORIGIN,
  apiBasePath: "/auth",
  websiteBasePath: "/auth",
}

const superbaseSigningSecret =
  process.env.SUPABASE_SIGNING_SECRET || "TODO: MISSING SUPABASE_SIGNING_SECRET"

const getSupertokensConfig = (): TypeInput => {
  return {
    framework: "express",
    supertokens: supertokensCoreInfo,
    appInfo,
    recipeList: [
      EmailVerification.init({ mode: "REQUIRED" }),
      EmailPassword.init({
        signUpFeature: {
          formFields: [
            {
              id: "email",
              optional: false,
              validate: validateEmail,
            },
            {
              id: "username",
              optional: false,
              validate: validateUsername,
            },
            { id: "password", optional: false },
          ],
        },
        override: {
          apis: (originalImplementation) => {
            return {
              ...originalImplementation,
              signUpPOST: async (input) => {
                // handle sign up
                if (originalImplementation.signUpPOST == undefined) {
                  logger.error("signUpPOST should not be undefined")
                  throw new Error("signUpPOST should not be undefined")
                }
                const usernameField = input.formFields.filter(
                  (field) => field.id === "username"
                )
                if (usernameField.length !== 1) {
                  return getErrorResponse("Username should not be empty")
                }
                const username = usernameField[0].value as string
                if (usernameField[0] != null && !validateUsername(username)) {
                  return getErrorResponse("Username is invalid")
                }
                const accountClient = AccountClient.getInstance()
                try {
                  const isValidUsername = await accountClient.isValidUsername(
                    username
                  )
                  if (!isValidUsername) {
                    return getErrorResponse("Username is not available")
                  }
                } catch (error: any) {
                  logger.error(error.message)
                  return getErrorResponse(
                    "Could not create account. Please try again later"
                  )
                }
                const response = await originalImplementation.signUpPOST(input)
                if (
                  response.status === "OK" &&
                  response.user.loginMethods.length === 1 &&
                  input.session === undefined
                ) {
                  // retrieve accessTokenPayload from user's session
                  const accessTokenPayload =
                    response.session.getAccessTokenPayload()
                  const supabase = getSupabase(
                    accessTokenPayload.supabase_token
                  )
                  // store user's email mapped to their user_id in Supabase
                  const { error } = await supabase.from("users").insert({
                    user_id: response.user.id,
                    email: response.user.emails[0],
                    username: username,
                  })
                  if (error) {
                    logger.error(error.message)
                    return getErrorResponse(
                      "Could not create account. Please try again later"
                    )
                  }
                }
                return response
              },
            }
          },
        },
      }),
      SessionNode.init({
        override: {
          functions: (originalImplementation) => {
            return {
              ...originalImplementation,
              createNewSession: async (input) => {
                const payload = {
                  userId: input.userId,
                  exp: Math.floor(Date.now() / 1000) + 60 * 60,
                }
                const supabaseJwt = jwt.sign(payload, superbaseSigningSecret)
                input.accessTokenPayload = {
                  ...input.accessTokenPayload,
                  supabase_token: supabaseJwt,
                }
                return await originalImplementation.createNewSession(input)
              },
            }
          },
        },
      }),
    ],
    isInServerlessEnv: true,
  }
}

function getErrorResponse(errorMessage: string): GeneralErrorResponse {
  return {
    status: "GENERAL_ERROR",
    message: errorMessage,
  }
}

async function validateEmail(email: string) {
  // needs to be identical between frontend and backend
  const values = email.split("@")
  if (values.length === 1 || values.length > 2 || values[0].trim() === "") {
    return "Invalid email"
  }
  const emailDomain = values[1]
  const isValidEmailProvided = freeEmailDomains.includes(emailDomain)
  if (isValidEmailProvided) {
    return undefined // no error
  }
  return "Invalid email"
}

async function validateUsername(username: string) {
  // needs to be identical between frontend and backend
  const containsWhitespaceRegex = new RegExp(/[\s]/)
  if (containsWhitespaceRegex.test(username)) {
    return "Invalid username. Whitespace is invalid"
  }
  if (username.length > 64) {
    return "Invalid username. Exceeded max length of 64 characters"
  }
  if (containsProfanity(username)) {
    return "Invalid username. Profanity detected in username"
  }
  const containsInvalidCharactersRegex = new RegExp(/[:/%\\]/)
  if (containsInvalidCharactersRegex.test(username)) {
    return "Invalid username. The following characters are not allowed: ':', '/', '%', '\\'"
  }
  return undefined
}

function containsProfanity(text: string) {
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

export { getSupertokensConfig }
