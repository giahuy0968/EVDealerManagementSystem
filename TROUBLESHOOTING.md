# 🐛 TROUBLESHOOTING - Dealer Dashboard

## Vấn đề: App redirect về /login ngay lập tức

### ✅ NGUYÊN NHÂN
Đây là behavior **ĐÚNG**! App được thiết kế để:
1. Check authentication khi load
2. Nếu không có token → redirect về /login
3. Chỉ show dashboard khi đã login

### 🔧 GIẢI PHÁP ĐỂ TEST UI (Không có Backend)

#### **Cách 1: Mock User Data (Khuyến nghị)**

Tạm thời comment phần check authentication trong `ProtectedRoute.tsx`:

```tsx
// src/components/ProtectedRoute.tsx
export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth()

  // TEMPORARY: Skip auth check for testing
  return <>{children}</>
  
  // Original code (comment out):
  /*
  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <div>Unauthorized</div>
  }

  return <>{children}</>
  */
}
```

#### **Cách 2: Mock User trong AuthContext**

Trong `AuthContext.tsx`, tạm thời set mock user:

```tsx
// src/contexts/AuthContext.tsx
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // TEMPORARY: Mock user for testing
  const [user, setUser] = useState<User | null>({
    id: '1',
    username: 'demo',
    email: 'demo@dealer.com',
    role: 'DEALER_MANAGER',
    createdAt: new Date().toISOString()
  })
  
  const [loading, setLoading] = useState(false) // Skip loading
  
  // Comment out useEffect that checks token
  /*
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const userData = await authService.getCurrentUser()
          setUser(userData)
        } catch (error) {
          console.error('Failed to load user:', error)
          localStorage.removeItem('token')
        }
      }
      setLoading(false)
    }
    loadUser()
  }, [])
  */
  
  // Rest of the code...
}
```

#### **Cách 3: Truy cập trực tiếp Login page**

Vào http://localhost:5176/login để test login form trước.

### 📝 KHI BACKEND SẴN SÀNG:

1. **Bỏ comment code authentication**
2. **Set VITE_API_URL** trong `.env`:
   ```
   VITE_API_URL=http://localhost:8080
   ```
3. **Test login flow**:
   - Mở http://localhost:5176/login
   - Nhập credentials
   - Backend trả về token
   - App redirect về dashboard

### 🎯 HIỆN TẠI APP ĐANG HOẠT ĐỘNG ĐÚNG!

Lỗi bạn thấy **KHÔNG PHẢI LỖI**, đó là authentication flow bắt buộc phải login.

### ✅ ĐỂ XEM UI NGAY BÂY GIỜ:

Chọn một trong 2 cách trên để **tạm thời skip auth check** và xem toàn bộ UI.

---

## 🚀 QUICK FIX

Cách nhanh nhất: Comment dòng check user trong App.tsx:

```tsx
// src/App.tsx
export default function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  
  const isLoginPage = location.pathname === '/login'
  
  // TEMPORARY: Remove login redirect
  // if (isLoginPage) {
  //   return <Login />
  // }
  
  // Show login page if explicitly on /login path
  if (isLoginPage) {
    return <Login />
  }
  
  // Rest stays the same...
}
```

Sau đó truy cập http://localhost:5176 sẽ thấy dashboard ngay!
