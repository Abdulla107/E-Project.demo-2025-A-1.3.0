import React, { lazy, Suspense } from "react";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'; 
import { store } from './store/index.js'
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <Provider store={store}>
      <Suspense fallback={<div>Loading...</div>}>
        <App />
        <Toaster
          toastOptions={{
            position: 'top-center',
          }}

        />
      </Suspense>
    </Provider>
  // </StrictMode>,
)
