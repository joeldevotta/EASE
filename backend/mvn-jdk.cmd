@echo off
setlocal

if not defined EASE_JDK_HOME set "EASE_JDK_HOME=C:\Program Files\Java\jdk-27"
if not exist "%EASE_JDK_HOME%\bin\javac.exe" (
    echo JDK not found at "%EASE_JDK_HOME%". Set EASE_JDK_HOME to a JDK 25+ installation.
    exit /b 1
)
for /f "tokens=2" %%V in ('"%EASE_JDK_HOME%\bin\javac.exe" -version 2^>^&1') do set "JDK_VERSION=%%V"
for /f "tokens=1 delims=." %%V in ("%JDK_VERSION%") do set "JDK_MAJOR=%%V"
if not defined JDK_MAJOR (
    echo Could not determine the JDK version at "%EASE_JDK_HOME%".
    exit /b 1
)
if %JDK_MAJOR% LSS 25 (
    echo JDK 25 or newer is required; found JDK %JDK_MAJOR% at "%EASE_JDK_HOME%".
    exit /b 1
)

set "JAVA_HOME=%EASE_JDK_HOME%"
set "PATH=%JAVA_HOME%\bin;%PATH%"
pushd "%~dp0"
if errorlevel 1 exit /b 1

call mvn %*
set "MAVEN_EXIT=%ERRORLEVEL%"

popd
endlocal & exit /b %MAVEN_EXIT%
