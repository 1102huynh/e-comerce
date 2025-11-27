# 🔴 REAL BUG FOUND AND FIXED! 

## Vấn Đề Thực Tế
Admin/User đều bị redirect về login khi click "Proceed to Checkout" mặc dù vẫn đang login.

## 🎯 Root Cause - Tìm Ra!

### Bug #1: JWT Filter Dependencies Not Injected ✅ FIXED
```java
// PROBLEM:
@Bean
public JwtAuthenticationFilter jwtAuthenticationFilter() {
    return new JwtAuthenticationFilter();  // Created without Spring dependency injection!
}

// Dependencies @Autowired in filter but never injected
@Autowired
private JwtTokenProvider tokenProvider;    // = null!
@Autowired  
private CustomUserDetailsService customUserDetailsService;  // = null!

// Result: Filter cannot validate JWT → Authentication never set → Checkout blocked!
```

### Bug #2: Frontend Getting Wrong Field Names ✅ FIXED
```typescript
// PROBLEM - Backend returns userId, frontend looks for id
const { token, id, fullName, roles } = response.data;  // id = undefined!
setAuth({ id, email, fullName, roles }, token);

// SOLUTION
const { token, userId, fullName, roles } = response.data;  // ✅ userId
setAuth({ id: userId, email, fullName, roles }, token);
```

### Bug #3: CartService Also Has Same Null Issue ✅ FIXED
```java
// PROBLEM
private User getCurrentUser() {
    String email = SecurityContextHolder.getContext().getAuthentication().getName();
    // Can throw NullPointerException if authentication is null
}

// SOLUTION
private User getCurrentUser() {
    var authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !authentication.isAuthenticated()) {
        throw new RuntimeException("User is not authenticated");
    }
    String email = authentication.getName();  // Safe now
}
```

---

## 🔧 Fixes Applied

### 1. SecurityConfig.java - Properly Inject Dependencies
```java
@Configuration
public class SecurityConfig {
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    @Autowired
    private CustomUserDetailsService customUserDetailsService;
    
    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        JwtAuthenticationFilter filter = new JwtAuthenticationFilter();
        filter.setTokenProvider(jwtTokenProvider);           // ← INJECT
        filter.setUserDetailsService(customUserDetailsService); // ← INJECT
        return filter;
    }
}
```

### 2. JwtAuthenticationFilter.java - Add Setters
```java
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private JwtTokenProvider tokenProvider;
    private CustomUserDetailsService customUserDetailsService;
    
    public void setTokenProvider(JwtTokenProvider tokenProvider) {
        this.tokenProvider = tokenProvider;
    }
    
    public void setUserDetailsService(CustomUserDetailsService customUserDetailsService) {
        this.customUserDetailsService = customUserDetailsService;
    }
}
```

### 3. login.page.tsx - Fix Field Name
```typescript
// BEFORE
const { token, id, fullName, roles } = response.data;

// AFTER
const { token, userId, fullName, roles } = response.data;
setAuth({ id: userId, email, fullName, roles }, token);
```

### 4. register/page.tsx - Fix Field Name
```typescript
// BEFORE
const { token, id, email, fullName, roles } = response.data;

// AFTER
const { token, userId, email, fullName, roles } = response.data;
setAuth({ id: userId, email, fullName, roles }, token);
```

### 5. CartService.java - Null Safety
```java
// BEFORE
private User getCurrentUser() {
    String email = SecurityContextHolder.getContext().getAuthentication().getName();
    ...
}

// AFTER
private User getCurrentUser() {
    var authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null || !authentication.isAuthenticated()) {
        throw new RuntimeException("User is not authenticated");
    }
    String email = authentication.getName();
    ...
}
```

---

## 🚀 Testing Now

Files changed:
1. ✅ src/main/java/com/huynhtdt/ecomerce/config/SecurityConfig.java
2. ✅ src/main/java/com/huynhtdt/ecomerce/security/JwtAuthenticationFilter.java
3. ✅ src/main/java/com/huynhtdt/ecomerce/service/CartService.java
4. ✅ frontend/app/login/page.tsx
5. ✅ frontend/app/register/page.tsx

### Build & Test
```bash
# Rebuild
mvn clean install

# Run backend
mvn spring-boot:run

# Run frontend (new terminal)
cd frontend
npm run dev
```

### Test Flow
```
1. Register with new email
2. Login with credentials
3. Add product to cart
4. Click "Proceed to Checkout"
5. ✅ Should see checkout form (NO LOGIN REDIRECT)
6. Complete and submit order
7. ✅ Order appears in /orders
```

---

## 📝 Why This Bug Happened

1. **Spring Bean Creation Issue**: Creating bean with `new` skips dependency injection
2. **No Compile-Time Check**: @Autowired on non-Spring-managed classes don't warn
3. **Silent Failures**: Filter ran but dependencies were null, caught by try-catch
4. **Frontend/Backend Mismatch**: Response field name changed but frontend wasn't updated

---

## ✅ Now It Should Work!

All JWT tokens will be properly validated and user authentication will be set before checkout endpoint is called.

