# Fix Compile Error: cannot find symbol class JwtTokenProvider

## Vấn Đề
```
JwtAuthenticationFilter.java:18:13 java: cannot find symbol
symbol: class JwtTokenProvider
location: class com.huynhtdt.ecomerce.security.JwtAuthenticationFilter
```

## Giải Pháp

### Cách 1: Clean Maven Cache (RECOMMENDED)

```bash
cd D:\practices\e-comerce

# 1. Clean project
mvn clean

# 2. Remove target folder (nếu còn)
rmdir /s /q target

# 3. Rebuild
mvn install -DskipTests
```

Hoặc chạy file batch:
```bash
D:\practices\e-comerce\clean-build.bat
```

### Cách 2: Refresh IDE (nếu dùng Eclipse/IntelliJ)

**Eclipse:**
- Right click project → Maven → Update Project
- Project → Clean → Clean All Projects

**IntelliJ:**
- File → Invalidate Caches → Invalidate and Restart
- Build → Rebuild Project

### Cách 3: Delete .classpath và .project (Eclipse only)

```bash
cd D:\practices\e-comerce
del .classpath
del .project

# Rồi import lại project vào Eclipse
```

### Cách 4: Xóa local Maven repo (nếu vẫn không được)

```bash
# Windows
rmdir /s /q %userprofile%\.m2\repository\com\huynhtdt

# Rồi
mvn clean install -DskipTests
```

---

## Bước Chạy Đúng

1. **Terminal/CMD ở D:\practices\e-comerce**

2. **Chạy clean-build.bat:**
   ```bash
   clean-build.bat
   ```
   
   Hoặc manual:
   ```bash
   mvn clean install -DskipTests
   ```

3. **Đợi compile hoàn thành** (nên thấy `BUILD SUCCESS`)

4. **Chạy backend:**
   ```bash
   mvn spring-boot:run
   ```

5. **Terminal mới, chạy frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

---

## Nếu Vẫn Lỗi

### Check 1: Xem file compiled chưa
```bash
dir target\classes\com\huynhtdt\ecomerce\security\
```
Nên có file JwtTokenProvider.class

### Check 2: Verify imports trong file
```
SecurityConfig.java line 3-4:
import com.huynhtdt.ecomerce.security.JwtTokenProvider;
import com.huynhtdt.ecomerce.security.CustomUserDetailsService;
```

### Check 3: Verify dependencies trong pom.xml
Phải có:
- spring-security
- jjwt (for JWT)
- spring-boot-starter-web

---

## Tóm Tắt

**Lỗi này thường do:**
1. Maven chưa compile lại sau khi edit
2. IDE cache code cũ
3. Java version mismatch

**Giải pháp:**
1. `mvn clean install -DskipTests` ← THỬ CÁI NÀY TRƯỚC
2. Refresh IDE
3. Delete target folder

Sau đó code sẽ compile thành công ✅

