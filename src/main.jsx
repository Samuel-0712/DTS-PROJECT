import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CucmsProvider } from './context/CucmsContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CucmsProvider>
        <App />
      </CucmsProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
