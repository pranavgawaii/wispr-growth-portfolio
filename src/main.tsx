import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { SiteAnalytics } from './components/ui/SiteAnalytics';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
    <SiteAnalytics />
  </React.StrictMode>,
);
