@echo off
echo ===== DIAGNOSTIC CHECK =====
echo.

echo 1. Checking Java version...
java -version

echo.
echo 2. Checking Maven version...
mvn -version

echo.
echo 3. Listing security package files...
dir "D:\practices\e-comerce\src\main\java\com\huynhtdt\ecomerce\security\"

echo.
echo 4. Checking target folder size...
dir /s "D:\practices\e-comerce\target\" 2>nul | find "File(s)" || echo (no target folder)

echo.
echo 5. Attempting clean compile...
cd /d D:\practices\e-comerce
echo Running: mvn clean compile -X 2>&1 | findstr /i "error ERROR"
mvn clean compile -X 2>&1 | findstr /i "error ERROR"

pause

