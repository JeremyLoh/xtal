import MailChecker from "mailchecker"
import jwt from "jsonwebtoken"
import EmailPassword from "supertokens-node/recipe/emailpassword"
import EmailVerification from "supertokens-node/recipe/emailverification"
import SessionNode from "supertokens-node/recipe/session"
import { TypeInput, AppInfo } from "supertokens-node/types"
import { supertokensCoreInfo } from "./superTokens.js"
import { getSupabase } from "../supabase/supabase.js"

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
              validate: async (email) => {
                if (MailChecker.isValid(email)) {
                  return undefined // no error
                }
                return "Invalid email"
              },
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
                  throw new Error("signUpPOST should not be undefined")
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
                  })
                  if (error) {
                    throw error
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

export { getSupertokensConfig }
