import { afterAll, afterEach, assert, beforeAll, beforeEach } from "vitest"
import { server } from "./__tests__/mocks/server.js"
import { getFrontendOrigin } from "./__tests__/cors/origin.js"
import { isValidUrl } from "./middleware/cors.js"

beforeEach(() => {
  const frontendOrigin = getFrontendOrigin()
  if (frontendOrigin == null || !isValidUrl(frontendOrigin)) {
    assert.fail(
      "FRONTEND_ORIGIN environment variable is not configured in backend/.env file"
    )
  }
})
beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
