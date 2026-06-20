import { Component } from 'react';

/**
 * React Error Boundary — catches runtime errors in the component tree and
 * renders a fallback UI instead of crashing the whole app. Class component
 * required because error boundaries rely on getDerivedStateFromError /
 * componentDidCatch, which are not available in function components.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - The wrapped content.
 * @param {React.ReactNode} [props.fallback] - Optional custom fallback UI.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
          <p className="text-6xl mb-4">🥀</p>
          <h2 className="text-xl font-bold text-earth-950 dark:text-white mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-earth-500 dark:text-earth-400 mb-6 max-w-md">
            An unexpected error occurred. Try refreshing the page or clearing your
            browser data on the Privacy page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
