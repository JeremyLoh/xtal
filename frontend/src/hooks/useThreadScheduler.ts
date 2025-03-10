import "scheduler-polyfill"
import { useCallback } from "react"

// https://web.dev/articles/optimize-long-tasks
function useThreadScheduler() {
  const yieldToMainThread = useCallback(async () => {
    if (scheduler?.yield) {
      return scheduler.yield()
    }
    // Fallback to yielding with setTimeout
    return new Promise((resolve) => {
      setTimeout(resolve, 0)
    })
  }, [])

  return {
    yieldToMainThread,
  }
}

export default useThreadScheduler
