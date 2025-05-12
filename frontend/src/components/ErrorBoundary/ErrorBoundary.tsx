import React, { PropsWithChildren } from "react"

type ErrorBoundaryProps = PropsWithChildren & {
  fallback: React.ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
}

// https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static getDerivedStateFromError(_error: Error) {
    // https://react.dev/reference/react/Component#static-getderivedstatefromerror
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  // componentDidCatch(error: Error, info: React.ErrorInfo) {
  //   // perform side effects when error is caught by error boundary, e.g. logging and analytics
  // }

  render() {
    if (this.state.hasError) {
      // render fallback ui
      return this.props.fallback
    }
    return this.props.children
  }
}
