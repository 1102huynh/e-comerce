# Troubleshooting Guide - Checkout Authentication Issues

## Symptom 1: Still Getting Redirected to Login

### Diagnosis Steps

#### Step 1: Check if Token is Being Stored
```javascript
// In browser console:
localStorage.getItem('token')

// Expected output: 
// "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIiwiaWF0IjoxNzMxMTU2NzAwLCJleHAiOjE3MzEyNDMxMDB9...."

// If output is null → Token not being stored
```

#### Step 2: Check if Token is Sent in Requests
```
1. Open DevTools (F12)
2. Go to Network tab
3. Click "Proceed to Checkout"
4. Find POST request to /api/orders/checkout
5. Click on request
6. Go to Headers tab
7. Look for: Authorization: Bearer <token>

If missing → Frontend API interceptor not working
```

#### Step 3: Check Backend JWT Validation
```
1. Look at backend console logs
2. Search for: "JWT token validation failed"
3. Search for: "Could not set user authentication"
4. Search for: "Set Spring Security authentication for user"

If step 3 appears → Authentication is working!
If step 1 or 2 appear → Token validation is failing
```

### Solutions

#### If Token is Not Stored
**Problem**: Login endpoint not returning token or frontend not saving it

**Check**:
```javascript
// In Network tab after login:
// POST /api/auth/login response body should contain:
{
    "token": "eyJhbGciOiJIUzUxMiJ9...",
    "id": 1,
    "email": "user@example.com",
    "roles": ["USER"]
}
```

**Fix**:
1. Verify AuthService returns AuthResponse with token
2. Verify login endpoint includes token in response:
   ```java
   return ResponseEntity.ok(new AuthResponse(token, user));
   ```

#### If Token is Not Sent in Headers
**Problem**: axios interceptor not working

**Check** `frontend/lib/api.ts`:
```javascript
// Should look like this:
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
```

**Fix**:
1. Verify interceptor is configured
2. Try clearing axios cache:
   ```javascript
   // In console:
   localStorage.clear()
   // Then re-login and try again
   ```

#### If Token Validation Fails
**Problem**: JWT token is invalid or malformed

**Solutions**:
1. **Token expired** - Default is 24 hours
   - Solution: Re-login
   - Or increase `jwt.expiration` in application.properties

2. **Token signature invalid** - JWT secret doesn't match
   - Verify `jwt.secret` is same in application.properties on all instances
   - Restart backend after changing secret

3. **Token malformed** - Contains wrong format
   - Clear localStorage: `localStorage.clear()`
   - Re-login
   - Try again

---

## Symptom 2: Getting 403 Forbidden Instead of Redirect

### Diagnosis
```
Status Code: 403 Forbidden
Response: {"error": "Access Denied"}
```

### Cause Analysis

This means:
- ✅ Token validation passed
- ✅ Authentication was set
- ❌ Authorization failed (@PreAuthorize check failed)

### Solutions

**For Checkout Endpoint**:
```java
@PreAuthorize("isAuthenticated()")
// This only checks if user is logged in, not role
// If you see 403, user might not be authenticated properly
```

**Debug Steps**:
1. Check user object in SecurityContextHolder:
   ```java
   // Add to OrderService.getCurrentUser():
   logger.info("Authentication: " + SecurityContextHolder.getContext().getAuthentication());
   logger.info("User: " + authentication.getPrincipal());
   logger.info("Authorities: " + authentication.getAuthorities());
   ```

2. Check backend logs for these messages
3. If user is null or authorities are empty → JWT filter issue

**Quick Fix**:
```
If @PreAuthorize is too strict:
Change @PreAuthorize("isAuthenticated()")
To: @PreAuthorize("permitAll()")
Then test if endpoint works
If it does → Authorization configuration is the issue
```

---

## Symptom 3: "User Not Found" Error

### Error Message
```
Failed to get current user: User not found with email: user@example.com
```

### Cause Analysis
- ✅ Token is valid
- ✅ Authentication was set
- ✅ Email extracted from token
- ❌ User doesn't exist in database

### Solutions

#### Solution 1: User was deleted from database
```sql
-- H2 console at http://localhost:8080/h2-console
SELECT * FROM users WHERE email = 'user@example.com';
-- If no results → user doesn't exist
```

**Fix**:
```sql
-- Re-insert user if needed
INSERT INTO users (email, full_name, password, created_at) 
VALUES ('user@example.com', 'User Name', 'hashed_password', CURRENT_TIMESTAMP);
```

#### Solution 2: Email mismatch in token
```javascript
// Decode token to see what email is stored:
// Use jwt.io to decode the token
// Look for "sub" field - that's the email
```

**Fix**:
- If token has wrong email → login again (generates new token with correct email)
- If token email is right but user not in DB → re-register

#### Solution 3: Database is cleared (in-memory H2)
- H2 uses in-memory database
- Application restart clears all data
- Solution: Re-register and login again

---

## Symptom 4: "User is Not Authenticated" Error

### Error Message
```
Failed to get current user: User is not authenticated. Please login again.
```

### Cause Analysis
- Token is present in request
- Token was validated
- But SecurityContextHolder.getAuthentication() returned null or unauthenticated

### Root Causes

#### Cause 1: JWT Filter Exception
Token validation threw exception (caught silently)

**Check logs**:
```
[ERROR] Could not set user authentication in security context: <exception>
```

**Solutions**:
1. Verify JWT secret matches what generated the token
2. Verify token is not corrupted
3. Try re-login to generate fresh token

#### Cause 2: User Not Found During Filter
`customUserDetailsService.loadUserByUsername()` threw exception

**Check logs**:
```
[ERROR] Could not set user authentication: User not found
```

**Solutions**:
1. Verify user exists in database: `SELECT * FROM users`
2. Verify email in token matches database
3. Re-register user if needed

#### Cause 3: Filter Not Running
JWT filter disabled or wrong order

**Check SecurityConfig.java**:
```java
http.addFilterBefore(
    jwtAuthenticationFilter(), 
    UsernamePasswordAuthenticationFilter.class  // ← Important order
);
```

**If filter not running**:
- Verify filter is added to security filter chain
- Verify `@Override doFilterInternal()` method exists
- Verify `getJwtFromRequest()` is extracting token correctly

---

## Symptom 5: Getting 401 Unauthorized

### Error Message
```
HTTP 401 Unauthorized
```

### Cause Analysis
Token is missing from Authorization header

### Solutions

#### Check 1: Is token in localStorage?
```javascript
localStorage.getItem('token')  // Should not be null
```

#### Check 2: Is header being sent?
```
DevTools > Network > POST /api/orders/checkout
Headers: Authorization: Bearer <token>  // Should be present
```

#### Check 3: Is api interceptor working?
```javascript
// In frontend/lib/api.ts:
// Should have:
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;  // ← This line
    }
    return config;
});
```

#### Check 4: Is CORS configured?
```
DevTools > Network > POST /api/orders/checkout
Response Headers should have:
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Credentials: true
```

### Quick Debug Script
```javascript
// Run this in browser console during checkout:
const token = localStorage.getItem('token');
console.log('Token stored:', !!token);
console.log('Token value:', token?.substring(0, 50) + '...');

// Check what api instance will send:
import api from '@/lib/api';
console.log('API defaults:', api.defaults);
```

---

## Quick Reset

If everything is broken, try this clean reset:

### 1. Frontend Reset
```bash
# Clear all browser data
# OR run in browser console:
localStorage.clear();
sessionStorage.clear();

# Hard refresh
Ctrl+Shift+R (or Cmd+Shift+R on Mac)

# Restart frontend
cd frontend
npm run dev
```

### 2. Backend Reset
```bash
# Stop backend (Ctrl+C)
# Then:
mvn clean install
mvn spring-boot:run

# This resets H2 in-memory database
```

### 3. Test Fresh Flow
```
1. Go to http://localhost:3000
2. Register new account (or use existing if in DB)
3. Login
4. Add product to cart
5. Click Proceed to Checkout
6. Check if it works
```

---

## Common Error Messages and Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `"User is not authenticated"` | JWT filter not setting auth | Restart backend, re-login |
| `"User not found with email"` | User in token not in DB | Re-register user |
| `"JWT token validation failed"` | Token invalid/expired | Re-login |
| `"Could not set user authentication"` | Exception in filter | Check logs, restart backend |
| 401 Unauthorized | No token in header | Check localStorage has token |
| 403 Forbidden | Auth set but authorization failed | Check @PreAuthorize rules |

---

## Testing Checklist

Use this to verify everything works:

- [ ] Can register new user
- [ ] Can login successfully
- [ ] Token stored in localStorage
- [ ] Can see user email in console
- [ ] Can add product to cart
- [ ] Cart count increases
- [ ] Can click "Proceed to Checkout"
- [ ] Checkout form displays (NO redirect)
- [ ] Checkout form has user data pre-filled
- [ ] Authorization header visible in Network tab
- [ ] Checkout POST request succeeds (200 OK)
- [ ] Order appears in /orders page

If all pass → System is working! ✅

---

## Getting Help

If the above doesn't work:

1. **Collect information**:
   - Screenshot of error message
   - Full browser console log
   - Backend console log (especially around login/checkout)
   - Network tab screenshot showing failed request
   - What step fails (login, checkout, order creation)

2. **Check these files**:
   - `src/main/java/com/huynhtdt/ecomerce/security/JwtAuthenticationFilter.java`
   - `src/main/java/com/huynhtdt/ecomerce/controller/OrderController.java`
   - `frontend/lib/api.ts`
   - `src/main/resources/application.properties`

3. **Verify recent changes**:
   - Were all 3 files modified as documented?
   - Is `mvn clean install` run after changes?
   - Is backend restarted?
   - Is frontend restarted?

