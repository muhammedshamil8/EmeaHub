import React from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
        // You can log to an error reporting service here
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
                    <div className="max-w-lg w-full text-center">
                        <h1 className="text-6xl font-bold text-primary-600 dark:text-primary-400">500</h1>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-4">
                            Something went wrong
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            We're sorry, but something unexpected happened. Please try again later.
                        </p>
                        <div className="mt-6 space-x-4">
                            <button
                                onClick={() => window.location.reload()}
                                className="inline-flex justify-center items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-medium rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                                Refresh Page
                            </button>
                            <Link
                                to="/"
                                className="inline-flex justify-center items-center px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                Go Home
                            </Link>
                        </div>
                        {process.env.NODE_ENV === 'development' && (
                            <pre className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-left overflow-auto">
                                <code className="text-sm text-red-600 dark:text-red-400">
                                    {this.state.error?.toString()}
                                </code>
                            </pre>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;