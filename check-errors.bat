@echo off
cd /d D:\practices\e-comerce
mvn clean compile 2>&1 | tee build-errors.log
echo.
echo Errors saved to build-errors.log
pause

