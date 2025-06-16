import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { Toaster } from "@/components/ui/sonner";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App.jsx";
import store, { persistor } from "./app/store.js";
import "./index.css";

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null, errorInfo: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">
              Something went wrong.
            </h1>
            <p className="mt-2 text-gray-600">
              Please try again later or refresh the page.
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Error Details: {this.state.error?.message || "Unknown error"}
            </p>
            {this.state.errorInfo && (
              <p className="mt-2 text-sm text-gray-500">
                Component Stack: {this.state.errorInfo.componentStack}
              </p>
            )}
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate
        loading={<div>Loading Persisted State...</div>}
        persistor={persistor}
      >
        <ErrorBoundary>
          <App />
          <Toaster />
        </ErrorBoundary>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
