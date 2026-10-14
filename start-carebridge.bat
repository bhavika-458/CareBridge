@echo off
echo Starting CareBridge microservices...

start "eureka-server" cmd /k "cd /d D:\Spring-boot\carebridge-main\eureka-server && mvn spring-boot:run"
timeout /t 15 /nobreak

start "config-server" cmd /k "cd /d D:\Spring-boot\carebridge-main\config-server && mvn spring-boot:run"
timeout /t 15 /nobreak

start "auth-service" cmd /k "cd /d D:\Spring-boot\carebridge-main\auth-service && mvn spring-boot:run"
timeout /t 10 /nobreak

start "patient-service" cmd /k "cd /d D:\Spring-boot\carebridge-main\patient-service && mvn spring-boot:run"
timeout /t 10 /nobreak

start "api-gateway" cmd /k "cd /d D:\Spring-boot\carebridge-main\api-gateway && mvn spring-boot:run"

echo All services launching. Check each window for startup status.
echo Eureka dashboard: http://localhost:8761
pause
