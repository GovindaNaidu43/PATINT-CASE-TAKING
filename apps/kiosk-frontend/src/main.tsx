import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import './i18n';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Suspense fallback={<div className="h-screen w-screen bg-royal-bg flex items-center justify-center text-royal-gold font-display text-2xl">Loading...</div>}>
        <App />
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>
);
