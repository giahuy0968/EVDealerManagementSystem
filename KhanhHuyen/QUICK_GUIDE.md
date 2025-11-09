# 🚀 HƯỚNG DẪN NHANH - Các phần đã thêm

## ✅ ĐÃ HOÀN THÀNH

### 1️⃣ Types & DTOs
**Location:** `frontend/dealer-dashboard/src/types/index.ts`
- 50+ interfaces cho tất cả API requests/responses
- Export để dùng trong services và components

### 2️⃣ API Services  
**Location:** `frontend/dealer-dashboard/src/services/`

6 services đầy đủ:
```typescript
import { authService } from './services/authService'
import { customerService } from './services/customerService'
import { dealerService } from './services/dealerService'
import { manufacturerService } from './services/manufacturerService'
import { reportService } from './services/reportService'
import { notificationService } from './services/notificationService'
```

### 3️⃣ Authentication & RBAC
**Location:** `frontend/dealer-dashboard/src/contexts/AuthContext.tsx`

Sử dụng:
```tsx
import { useAuth } from './contexts/AuthContext'

function MyComponent() {
  const { user, login, logout, hasRole } = useAuth()
  
  if (hasRole(['DEALER_MANAGER'])) {
    // Show manager-only content
  }
}
```

### 4️⃣ Protected Routes
**Location:** `frontend/dealer-dashboard/src/components/ProtectedRoute.tsx`

Sử dụng trong routing:
```tsx
<Route path="/orders" element={
  <ProtectedRoute allowedRoles={['DEALER_MANAGER']}>
    <Orders />
  </ProtectedRoute>
} />
```

### 5️⃣ New Pages

#### Orders Page
- Quản lý đơn hàng
- Status tracking
- Create new order

#### Quotations Page  
- Tạo báo giá cho khách hàng
- Track pricing và promotions

#### Test Drives Page
- Schedule test drive appointments
- Track completions và cancellations

#### Inventory Page
- Quản lý tồn kho
- Low stock alerts
- Request stock từ manufacturer

#### Reports Page
- Sales reports
- Inventory reports  
- Top selling models

---

## 🎯 CÁC TÍNH NĂNG MỚI

### Auto Token Management
File `src/lib/api.ts` tự động:
- ✅ Attach Bearer token vào headers
- ✅ Refresh token khi expired
- ✅ Redirect về login nếu refresh fail

### Role-Based Menus
File `src/App.tsx`:
- ✅ Menu items thay đổi theo user role
- ✅ Dealer Staff: Ít items hơn
- ✅ Dealer Manager: Full access

### Loading States
Tất cả pages có:
- ✅ Loading spinner khi fetch data
- ✅ Empty states khi no data
- ✅ Error handling

---

## 📖 CÁCH SỬ DỤNG

### Tạo Page Mới

1. **Tạo component:**
```tsx
// src/pages/MyNewPage.tsx
import { useState, useEffect } from 'react'
import { dealerService } from '../services/dealerService'

export default function MyNewPage() {
  const [data, setData] = useState([])
  
  useEffect(() => {
    dealerService.getSomething().then(setData)
  }, [])
  
  return (
    <div className="card">
      <h2>My New Page</h2>
    </div>
  )
}
```

2. **Thêm route vào App.tsx:**
```tsx
import MyNewPage from './pages/MyNewPage'

// Trong <Routes>:
<Route path="/mynewpage" element={
  <ProtectedRoute allowedRoles={['DEALER_MANAGER']}>
    <MyNewPage />
  </ProtectedRoute>
} />
```

3. **Thêm menu item:**
```tsx
// Trong getMenuItems():
{ 
  path: '/mynewpage', 
  label: '📄 My New Page', 
  roles: ['DEALER_MANAGER'] 
}
```

### Gọi API

```tsx
// Import service
import { dealerService } from '../services/dealerService'

// Trong component:
const handleCreateOrder = async () => {
  try {
    const order = await dealerService.createOrder({
      customerId: '123',
      items: [{ carModelId: '456', quantity: 1 }],
      paymentMethod: 'CASH'
    })
    console.log('Order created:', order)
  } catch (error) {
    console.error('Failed:', error)
  }
}
```

### Check Permissions

```tsx
import { useAuth } from './contexts/AuthContext'

function AdminButton() {
  const { hasRole } = useAuth()
  
  if (!hasRole(['ADMIN', 'DEALER_MANAGER'])) {
    return null // Hide button
  }
  
  return <button>Admin Action</button>
}
```

---

## 🔧 NEXT STEPS

### Khi Backend Ready:

1. **Update .env:**
```
VITE_API_URL=http://localhost:8080
```

2. **Test Login:**
- Gọi API thật
- Nhận token
- Auto refresh hoạt động

3. **Test từng page:**
- Load data từ API
- Create/Update operations
- Error handling

### Thêm Features:

1. **Form Validation:**
```bash
npm install react-hook-form zod
```

2. **Charts:**
```bash
npm install recharts
```

3. **Toast Notifications:**
```bash
npm install react-hot-toast
```

4. **Date Picker:**
```bash
npm install react-datepicker
```

---

## 📝 DEMO CREDENTIALS

Khi backend hoạt động, có thể dùng:

**Dealer Staff:**
```
Email: staff@dealer.com
Password: password123
```

**Dealer Manager:**
```
Email: manager@dealer.com  
Password: password123
```

**Admin:**
```
Email: admin@evdms.com
Password: admin123
```

---

## 🐛 TROUBLESHOOTING

### "Cannot find module" errors
```bash
npm install
```

### Token not working
- Check localStorage: `localStorage.getItem('token')`
- Check API calls có Authorization header
- Check backend CORS settings

### Routes not working
- Check BrowserRouter wrapper
- Check route paths match menu links
- Check ProtectedRoute allowedRoles

### Menu not showing
- Check user role in AuthContext
- Check getMenuItems() filtering logic
- Check user object structure

---

## 📚 TÀI LIỆU THAM KHẢO

- **React Router:** https://reactrouter.com
- **Axios:** https://axios-http.com
- **TypeScript:** https://www.typescriptlang.org
- **Vite:** https://vitejs.dev

---

**Tất cả code đã sẵn sàng để tích hợp với backend! 🎉**
