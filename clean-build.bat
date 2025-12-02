@echo off
cd /d D:\practices\e-comerce
echo Cleaning...
mvn clean
echo.
echo Building...
mvn install -DskipTests
echo.
echo Done!
pause

