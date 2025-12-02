# 🐛 FIX: Checkout Force Login Issue - Complete Debug Guide

## 📋 Problem Summary
User được login thành công, nhưng khi nhấn "Proceed to Checkout" bị buộc redirect về login lại.

## ✅ Root Causes Fixed

### 1. ❌ Middleware Issue (FIXED)
**Problem**: Middleware kiểm tra token từ cookies, nhưng token lưu ở localStorage
**File**: `middleware.ts`
**Solution**: Loại bỏ server-side auth check - dùng client-side `useAuthHydration` hook thay vì

```typescript
// ❌ OLD - Lỗi: middleware không thể access localStorage
const token = request.cookies.get('token')?.value;

// ✅ NEW - Client-side check dùng useAuthHydration hook
// Middleware chỉ cho phép routing, không check auth
```

### 2. ❌ Toast Library Mismatch (FIXED)
**Problem**: Một số file dùng `react-hot-toast`, một số dùng `sonner`
**Files Updated**:
- ✅ `/app/login/page.tsx`
- ✅ `/app/register/page.tsx`
- ✅ `/app/cart/page.tsx`
- ✅ `/app/orders/page.tsx`
- ✅ `/app/products/[id]/page.tsx`
- ✅ `/components/ProductCard.tsx`
- ✅ `/app/admin/orders/page.tsx`
- ✅ `/app/admin/products/page.tsx`
- ✅ `/app/admin/categories/page.tsx`

### 3. ❌ useAuthHydration Hook Not Used Correctly (FIXED)
**Problem**: Checkout page set isHydrated ngay lập tức, không chờ Zustand hydrate
**File**: `/app/checkout/page.tsx`
**Solution**: 
```typescript
// ❌ OLD - Không chờ hydration
const [isHydrated, setIsHydrated] = useState(false);
useEffect(() => {
  setIsHydrated(true); // Set ngay, chưa load từ localStorage
}, []);

// ✅ NEW - Dùng hook, hook tự handle hydration
const { user, isHydrated } = useAuthHydration();
```

### 4. ❌ API Import Issue (FIXED)
**Problem**: `import api from '@/lib/api'` không hoạt động vì default export
**Solution**: 
```typescript
// ✅ Cách mới - dùng named import + default
import * as apiModule from '@/lib/api';
const api = apiModule.default;
```

### 5. ❌ Hydration Timing (FIXED)
**Problem**: Component render trước khi Zustand hydrate từ localStorage
**Solution**: Thêm 100ms timeout để Zustand load từ localStorage

```typescript
useEffect(() => {
  const timer = setTimeout(() => {
    setIsHydrated(true);
  }, 100); // Wait for Zustand to hydrate
  return () => clearTimeout(timer);
}, []);
```

## 🔍 How Authentication Flow Works Now

### Step 1: User Logs In
```
Frontend (login page)
  ↓ POST /api/auth/login
Backend (AuthService)
  ↓ Returns: { token, userId, email, fullName, roles }
Frontend (useAuthStore.setAuth)
  ↓ Saves: localStorage.token + Zustand state
  ↓ Navigates: /products
```

### Step 2: User Goes to Checkout
```
Frontend (useRouter navigate to /checkout)
  ↓ Middleware: Allow (no server-side auth check)
  ↓ Checkout page mounts
  ↓ useAuthHydration hook:
    - Wait 100ms for Zustand hydrate from localStorage
    - Load user + token from Zustand store
    - Set isHydrated = true
  ↓ useEffect checks: if (!isHydrated) return
  ↓ If user exists: proceed with checkout
  ↓ If user missing: redirect to /login
```

### Step 3: API Calls
```
Frontend (checkout form submit)
  ↓ api.interceptors.request (from lib/api.ts)
  ↓ Get token from localStorage
  ↓ Add: Authorization: Bearer {token}
  ↓ POST /api/orders/checkout
Backend (SecurityConfig)
  ↓ JwtAuthenticationFilter validates token
  ↓ If valid: set SecurityContext
  ↓ If invalid: 401 Unauthorized
```

## 🧪 Testing Checklist

### 1. Clear All Storage
```javascript
localStorage.clear();
sessionStorage.clear();
// Reload page
```

### 2. Register New Account
- Email: `test@example.com`
- Password: `password123`
- Check console logs:
  ```
  ✅ setAuth called
  ✅ localStorage.token set
  ✅ Zustand store updated
  ```

### 3. Navigate to Products
- Add item to cart
- Check console:
  ```
  ✅ Token sent in API interceptor
  ✅ Authorization header set
  ```

### 4. Go to Checkout
- Check browser console:
  ```
  🔄 useAuthHydration - Component mounted
  ✅ useAuthHydration - Hydration complete
  ✅ User authenticated: test@example.com
  ✅ Cart loaded
  ```

### 5. Place Order
- Fill form + payment details
- Submit checkout
- Expected:
  - ✅ Token sent in request
  - ✅ Backend validates JWT
  - ✅ Order created
  - ✅ Redirect to /orders

## 🚀 Debug Commands

```javascript
// In browser console at any time:

// Check 1: Auth Store
window.__testCheckout()

// Check 2: Token
localStorage.getItem('token')

// Check 3: User
JSON.parse(localStorage.getItem('auth-storage')).state.user

// Check 4: API Interceptor (make any API call)
// Look for: "🔍 API Interceptor - Token from localStorage: ✅ Found"

// Check 5: Network (F12 → Network tab)
// Click checkout form
// Filter: "checkout"
// Check request headers for "Authorization: Bearer ..."
```

## 📊 State Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│ Browser Load /checkout                                   │
└──────────────────────┬──────────────────────────────────┘
                       ↓
        ┌──────────────────────────────┐
        │ Middleware                   │
        │ (Allow all routes)           │
        └──────────────┬───────────────┘
                       ↓
        ┌──────────────────────────────┐
        │ CheckoutPage Component       │
        │ Mounts                       │
        └──────────────┬───────────────┘
                       ↓
        ┌──────────────────────────────┐
        │ useAuthHydration Hook        │
        │ - Start: isHydrated = false  │
        │ - Wait: 100ms                │
        │ - Load: localStorage +       │
        │   Zustand store              │
        │ - End: isHydrated = true     │
        └──────────────┬───────────────┘
                       ↓
        ┌──────────────────────────────┐
        │ useEffect check auth         │
        │ if (!isHydrated) return      │
        │ if (!user) redirect /login   │
        │ else: load form + cart       │
        └──────────────┬───────────────┘
                       ↓
        ┌──────────────────────────────┐
        │ User fills checkout form     │
        │ + payment details            │
        └──────────────┬───────────────┘
                       ↓
        ┌──────────────────────────────┐
        │ Submit form                  │
        │ - API interceptor:           │
        │   Add token to header        │
        │ - POST /orders/checkout      │
        └──────────────┬───────────────┘
                       ↓
        ┌──────────────────────────────┐
        │ Backend:                     │
        │ - JwtAuthenticationFilter    │
        │ - Validate token             │
        │ - Create order               │
        │ - Return success             │
        └──────────────┬───────────────┘
                       ↓
        ┌──────────────────────────────┐
        │ Frontend:                    │
        │ - Show success toast         │
        │ - Redirect /orders           │
        └──────────────────────────────┘
```

## ⚠️ Common Issues & Solutions

### Issue 1: Token Missing in Request
**Symptoms**: Backend returns 401 Unauthorized
**Solution**:
```javascript
// Check in browser console:
localStorage.getItem('token') // Should have value
// If empty: User didn't login properly
```

### Issue 2: useAuthHydration Returns Empty User
**Symptoms**: Immediately redirect to /login
**Solution**:
```javascript
// Increase hydration timeout
const timer = setTimeout(() => {
  setIsHydrated(true);
}, 200); // Increase from 100 to 200ms
```

### Issue 3: Multiple Redirect Loops
**Symptoms**: Redirect loop between /checkout and /login
**Solution**:
```javascript
// Clear storage and re-login
localStorage.clear();
// Reload and re-login
```

## 📝 Summary of Changes

| File | Change | Why |
|------|--------|-----|
| `middleware.ts` | Removed auth check | localStorage not accessible on server |
| `useAuthHydration.ts` | Added logging | Debug hydration timing |
| `checkout/page.tsx` | Use hook correctly | Wait for Zustand hydrate |
| `lib/api.ts` | Fixed export | Default export for consistency |
| `lib/toast.ts` | Created wrapper | Centralize toast import |
| `login/page.tsx` | Use sonner + proper import | Consistent toast library |
| All other pages | Use sonner | Match toast library |

## ✅ Verification Steps

1. **Run frontend**: `npm run dev`
2. **Run backend**: `mvn spring-boot:run`
3. **Test flow**:
   - Register account
   - Add to cart
   - Go to checkout
   - Check console logs
   - Verify no redirect
   - Submit order

## 🎉 Expected Result

✅ User stays logged in
✅ Token sent in checkout request
✅ Order creates successfully
✅ Redirect to /orders
✅ No "force login again" issue

