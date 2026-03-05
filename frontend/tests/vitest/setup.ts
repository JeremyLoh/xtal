import "@testing-library/jest-dom/vitest"
import { vi, beforeAll, afterEach } from "vitest"
import nock from "nock"

beforeAll(() => {
  // mock app dark theme / light theme
  Object.defineProperty(globalThis, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.resetAllMocks()
  nock.cleanAll()
})
