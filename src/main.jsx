import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AgencyProvider } from './context/AgencyContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AgencyProvider>
      <App />
    </AgencyProvider>
  </React.StrictMode>
);
