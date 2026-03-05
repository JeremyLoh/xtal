import "@testing-library/jest-dom/vitest"
import { vi, afterEach } from "vitest"
import nock from "nock"

afterEach(() => {
  vi.restoreAllMocks()
  vi.resetAllMocks()
  nock.cleanAll()
})
