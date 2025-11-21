import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './shared/contexts/AuthContext'
import Login from './shared/pages/Login'
import RoleBasedRoute from './shared/components/RoleBasedRoute'

// Admin
import AdminLayout from './admin/layouts/AdminLayout'
import AdminDashboard from './admin/pages/Dashboard'
import UserManagement from './admin/pages/UserManagement'

// Dealer Staff
import DealerStaffLayout from './dealer-staff/layouts/DealerStaffLayout'
import DealerStaffDashboard from './dealer-staff/pages/Dashboard'
import CustomerManagement from './dealer-staff/pages/CustomerManagement'
import LeadManagement from './dealer-staff/pages/LeadManagement'
import TestDriveManagement from './dealer-staff/pages/TestDriveManagement'
import FeedbackManagement from './dealer-staff/pages/FeedbackManagement'

// Dealer Manager
import DealerManagerLayout from './dealer-manager/layouts/DealerManagerLayout'
import DealerManagerDashboard from './dealer-manager/pages/Dashboard'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<RoleBasedRoute allowedRoles={['ADMIN']}><AdminLayout /></RoleBasedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
          </Route>
          
          {/* Dealer Staff Routes */}
          <Route path="/dealer-staff" element={<RoleBasedRoute allowedRoles={['DEALER_STAFF']}><DealerStaffLayout /></RoleBasedRoute>}>
            <Route index element={<DealerStaffDashboard />} />
            <Route path="customers" element={<CustomerManagement />} />
            <Route path="leads" element={<LeadManagement />} />
            <Route path="test-drives" element={<TestDriveManagement />} />
            <Route path="feedbacks" element={<FeedbackManagement />} />
          </Route>
          
          {/* Dealer Manager Routes */}
          <Route path="/dealer-manager" element={<RoleBasedRoute allowedRoles={['DEALER_MANAGER']}><DealerManagerLayout /></RoleBasedRoute>}>
            <Route index element={<DealerManagerDashboard />} />
            <Route path="customers" element={<CustomerManagement />} />
            <Route path="leads" element={<LeadManagement />} />
            <Route path="test-drives" element={<TestDriveManagement />} />
            <Route path="feedbacks" element={<FeedbackManagement />} />
            <Route path="users" element={<UserManagement />} />
          </Route>
          
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
