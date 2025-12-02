# 🛠️ BUILD ERROR TROUBLESHOOTING GUIDE

## Bước 1: Xác Định Loại Lỗi

Chạy build và ghi lại error message:
```bash
cd D:\practices\e-comerce
mvn clean compile 2>&1 > build-errors.txt
```

Mở `build-errors.txt` và tìm keyword:

---

## Common Build Errors & Fixes

### Error 1: "cannot find symbol"
```
[ERROR] error: class JwtTokenProvider not found
```

**Fix:**
```bash
# 1. Clean Maven cache
rmdir /s /q %userprofile%\.m2\repository\com\huynhtdt

# 2. Clean rebuild
mvn clean install -DskipTests
```

---

### Error 2: "Java version incompatible"
```
[ERROR] release version 17 not supported
```

**Fix - Edit pom.xml:**
```xml
<!-- Change from 17 to 11 -->
<java.version>11</java.version>

<!-- Also check maven-compiler-plugin -->
<source>11</source>
<target>11</target>
```

---

### Error 3: "Compilation failure"
```
[ERROR] /path/to/File.java:[line] error: expected
```

**Fix:**
1. Go to that file
2. Check line for unclosed brackets, semicolons
3. Use IDE to auto-format: `Ctrl+Shift+F`

---

### Error 4: "Package does not exist"
```
[ERROR] package xxx does not exist
```

**Fix:**
```bash
# 1. Check pom.xml has dependency
# 2. Force download
mvn dependency:resolve

# 3. Rebuild
mvn clean install -DskipTests
```

---

### Error 5: "Method not found"
```
[ERROR] method validate in class X cannot be applied to given types
```

**Fix:**
1. Check method signature in source
2. Check parameter types match
3. Check imports are correct

---

## Full Clean Build Process

```bash
@REM 1. Navigate to project
cd /d D:\practices\e-comerce

@REM 2. Remove all artifacts
rmdir /s /q target
rmdir /s /q .classpath
rmdir /s /q .project

@REM 3. Remove Maven local cache (optional)
rmdir /s /q %userprofile%\.m2\repository\com\huynhtdt

@REM 4. Clean compile
mvn clean compile -DskipTests -X > build-log.txt

@REM 5. If successful, install
mvn install -DskipTests
```

---

## Quick Diagnostic Checklist

- [ ] Java installed? `java -version`
- [ ] Maven installed? `mvn -version`
- [ ] pom.xml has java.version=11
- [ ] All .java files closed with }
- [ ] No pink/red errors in IDE
- [ ] target folder cleaned
- [ ] No uncommitted changes
- [ ] Run: `mvn clean install -DskipTests`

---

## If Still Errors After Clean Build

1. **Post the ERROR MESSAGE** (the first [ERROR] line)
2. **Post the FILE NAME** (which file has error)
3. **Post the LINE NUMBER** (which line is problematic)

Example:
```
[ERROR] /D:/practices/e-comerce/src/.../File.java:45: error: xxx
        error details here
                       ^
```

With this info I can fix it exactly.

---

## Expected Build Success Output

When build is OK, you should see:
```
[INFO] BUILD SUCCESS
[INFO] Total time: X.XXs
[INFO] Finished at: ...
[INFO] Final Memory: ...
```

---

## Next Steps After Successful Build

1. Run backend: `mvn spring-boot:run`
2. Run frontend: `cd frontend && npm run dev`
3. Test checkout flow
4. Verify ✅ no login redirect

---

## Emergency Nuclear Option (Last Resort)

```bash
@REM Delete everything and start fresh
cd /d D:\practices\e-comerce
rmdir /s /q target
rmdir /s /q node_modules
rmdir /s /q %userprofile%\.m2\repository

@REM Reinstall everything
mvn clean install -DskipTests
cd frontend
npm install
npm run dev
```

---

## How to Share Error Details

If still stuck, provide:

1. **Full error output** (first 20 lines of errors):
   ```
   [ERROR] ...
   [ERROR] ...
   ```

2. **Affected file**:
   ```
   /path/to/File.java:123
   ```

3. **What you're doing**:
   ```
   mvn clean compile
   ```

With these details, I can fix it immediately.

