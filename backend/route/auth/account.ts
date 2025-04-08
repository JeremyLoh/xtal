import { Response, Router } from "express"
import { deleteUser } from "supertokens-node"
import Session from "supertokens-node/recipe/session"
import { verifySession } from "supertokens-node/recipe/session/framework/express"
import { SessionRequest } from "supertokens-node/framework/express"
import rateLimiter from "../../middleware/rateLimiter.js"

const router = Router()

router.delete(
  "/api/account",
  rateLimiter.deleteAccountLimiter,
  verifySession({ sessionRequired: true }),
  async (request: SessionRequest, response: Response) => {
    const session = await Session.getSession(request, response)
    const userId = session.getUserId()
    await deleteUser(userId)
    // delete session from db and frontend (cookies)
    await request.session!.revokeSession()
    response.sendStatus(200)
  }
)

export default router
