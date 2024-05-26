import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@components/App'
import ErrorBoundary from "@components/errorBoundary";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <ErrorBoundary>
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </ErrorBoundary>
);
