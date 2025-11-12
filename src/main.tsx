import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginScreen from './test';
import AIUIScreen from './AIUI';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/aiui" element={<AIUIScreen />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
