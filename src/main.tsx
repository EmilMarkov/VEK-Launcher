import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@components/App';
import ErrorBoundary from "@components/errorBoundary";
import '@styles/globals.css';

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <ErrorBoundary>
        <App />
    </ErrorBoundary>
);
