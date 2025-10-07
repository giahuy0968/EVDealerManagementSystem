import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from 'c:/OOP-BUILD/EVDealerManagementSystem/frontend/manufacturer-dashboard/src/contexts/AuthContext'
import App from 'c:/OOP-BUILD/EVDealerManagementSystem/frontend/manufacturer-dashboard/src/App'
import 'c:/OOP-BUILD/EVDealerManagementSystem/frontend/manufacturer-dashboard/src/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)