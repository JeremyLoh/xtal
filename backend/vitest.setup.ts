import { afterAll, afterEach, beforeAll } from "vitest"
import { server } from "./__tests__/mocks/server.js"

beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
