// ErrorBoundary.js
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  // This lifecycle method catches errors in child components
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  // Optional: Log error information (e.g., send to a monitoring service)
  componentDidCatch(error, errorInfo) {
    console.log("Error caught in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>; // Fallback UI
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
