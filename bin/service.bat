@echo off
rem Licensed to the Apache Software Foundation (ASF) under one or more
rem contributor license agreements.  See the NOTICE file distributed with
rem this work for additional information regarding copyright ownership.
rem The ASF licenses this file to You under the Apache License, Version 2.0
rem (the "License"); you may not use this file except in compliance with
rem the License.  You may obtain a copy of the License at
rem
rem     http://www.apache.org/licenses/LICENSE-2.0
rem
rem Unless required by applicable law or agreed to in writing, software
rem distributed under the License is distributed on an "AS IS" BASIS,
rem WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
rem See the License for the specific language governing permissions and
rem limitations under the License.

rem ---------------------------------------------------------------------------
rem NT Service Install/Uninstall script
rem
rem Options
rem install                Install the service using Amplix5 as service name.
rem                        Service is installed using default settings.
rem remove                 Remove the service from the System.
rem
rem name        (optional) If the second argument is present it is considered
rem                        to be new service name
rem ---------------------------------------------------------------------------

setlocal

set "SELF=%~dp0%service.bat"
rem Guess CATALINA_HOME if not defined
set "CURRENT_DIR=%cd%"
if not "%CATALINA_HOME%" == "" goto gotHome
set "CATALINA_HOME=%cd%"
if exist "%CATALINA_HOME%\bin\amplix.exe" goto okHome
rem CD to the upper dir
cd ..
set "CATALINA_HOME=%cd%"
:gotHome
if exist "%CATALINA_HOME%\bin\amplix.exe" goto okHome
echo The amplix.exe was not found...
echo The CATALINA_HOME environment variable is not defined correctly.
echo This environment variable is needed to run this program
goto end
:okHome
rem Make sure prerequisite environment variables are set
if not "%JAVA_HOME%" == "" goto gotJdkHome
if not "%JRE_HOME%" == "" goto gotJreHome
echo Neither the JAVA_HOME nor the JRE_HOME environment variable is defined
echo Service will try to guess them from the registry.
goto okJavaHome
:gotJreHome
if not exist "%JRE_HOME%\bin\java.exe" goto noJavaHome
goto okJavaHome
:gotJdkHome
if not exist "%JAVA_HOME%\bin\javac.exe" goto noJavaHome
rem Java 9 has a different directory structure
if exist "%JAVA_HOME%\jre\bin\java.exe" goto preJava9Layout
if not exist "%JAVA_HOME%\bin\java.exe" goto noJavaHome
if not "%JRE_HOME%" == "" goto okJavaHome
set "JRE_HOME=%JAVA_HOME%"
goto okJavaHome
:preJava9Layout
if not "%JRE_HOME%" == "" goto okJavaHome
set "JRE_HOME=%JAVA_HOME%\jre"
goto okJavaHome
:noJavaHome
echo The JAVA_HOME environment variable is not defined correctly
echo This environment variable is needed to run this program
echo NB: JAVA_HOME should point to a JDK not a JRE
goto end
:okJavaHome
if not "%CATALINA_BASE%" == "" goto gotBase
set "CATALINA_BASE=%CATALINA_HOME%"
:gotBase

set "EXECUTABLE=%CATALINA_HOME%\bin\amplix.exe"

rem Set default Service name
set SERVICE_NAME=Tomcat9
set DISPLAYNAME=Amplix 5.1 %SERVICE_NAME%

rem Java 9 no longer supports the java.endorsed.dirs
rem system property. Only try to use it if
rem JAVA_ENDORSED_DIRS was explicitly set
rem or CATALINA_HOME/endorsed exists.
set ENDORSED_PROP=ignore.endorsed.dirs
if "%JAVA_ENDORSED_DIRS%" == "" goto noEndorsedVar
set ENDORSED_PROP=java.endorsed.dirs
goto doneEndorsed
:noEndorsedVar
if not exist "%CATALINA_HOME%\endorsed" goto doneEndorsed
set ENDORSED_PROP=java.endorsed.dirs
:doneEndorsed

if "x%1x" == "xx" goto displayUsage
set SERVICE_CMD=%1
shift
if "x%1x" == "xx" goto checkServiceCmd
:checkUser
if "x%1x" == "x/userx" goto runAsUser
if "x%1x" == "x--userx" goto runAsUser
set SERVICE_NAME=%1
set DISPLAYNAME=Amplix 5.1 %1
shift
if "x%1x" == "xx" goto checkServiceCmd
goto checkUser
:runAsUser
shift
if "x%1x" == "xx" goto displayUsage
set SERVICE_USER=%1
shift
runas /env /savecred /user:%SERVICE_USER% "%COMSPEC% /K \"%SELF%\" %SERVICE_CMD% %SERVICE_NAME%"
goto end
:checkServiceCmd
if /i %SERVICE_CMD% == install goto doInstall
if /i %SERVICE_CMD% == remove goto doRemove
if /i %SERVICE_CMD% == uninstall goto doRemove
echo Unknown parameter "%SERVICE_CMD%"
:displayUsage
echo.
echo Usage: service.bat install/remove [service_name] [/user username]
goto end

:doRemove
rem Remove the service
echo Removing the service '%SERVICE_NAME%' ...
echo Using CATALINA_BASE:    "%CATALINA_BASE%"

"%EXECUTABLE%" //DS//%SERVICE_NAME% ^
    --LogPath "%CATALINA_BASE%\logs"
if not errorlevel 1 goto removed
echo Failed removing '%SERVICE_NAME%' service
goto end
:removed
echo The service '%SERVICE_NAME%' has been removed
goto end

:doInstall
rem Install the service
echo Installing the service '%SERVICE_NAME%' ...
echo Using CATALINA_HOME:    "%CATALINA_HOME%"
echo Using CATALINA_BASE:    "%CATALINA_BASE%"
echo Using JAVA_HOME:        "%JAVA_HOME%"
echo Using JRE_HOME:         "%JRE_HOME%"

rem Try to use the server jvm
set "JVM=%JRE_HOME%\bin\server\jvm.dll"
if exist "%JVM%" goto foundJvm
rem Try to use the client jvm
set "JVM=%JRE_HOME%\bin\client\jvm.dll"
if exist "%JVM%" goto foundJvm
echo Warning: Neither 'server' nor 'client' jvm.dll was found at JRE_HOME.
set JVM=auto
:foundJvm
echo Using JVM:              "%JVM%"

set "CLASSPATH=%CATALINA_HOME%\bin\amplix_launcher-4.1.0.jar;%CATALINA_HOME%\bin\amplix-4.1.0.jar;%CATALINA_HOME%\lib\slf4j-api-2.0.7.jar;%CATALINA_HOME%\lib\logback-core-1.3.6.jar;%CATALINA_HOME%\lib\logback-classic-1.3.6.jar;%CATALINA_HOME%\lib\tomcat-embed-core-9.0.71.jar;%CATALINA_HOME%\lib\tomcat-annotations-api-9.0.71.jar;%CATALINA_HOME%\lib\tomcat-api-9.0.71.jar;%CATALINA_HOME%\lib\tomcat-el-api-9.0.71.jar;%CATALINA_HOME%\lib\tomcat-embed-core-9.0.71.jar;%CATALINA_HOME%\lib\tomcat-embed-el-9.0.71.jar;%CATALINA_HOME%\lib\tomcat-embed-jasper-9.0.71.jar;%CATALINA_HOME%\lib\tomcat-jasper-9.0.71.jar;%CATALINA_HOME%\lib\tomcat-jasper-el-9.0.71.jar;%CATALINA_HOME%\lib\tomcat-jsp-api-9.0.71.jar;%CATALINA_HOME%\lib\joda-time-2.9.9.jar;%CATALINA_HOME%\lib\commons-codec-1.11.jar;%CATALINA_HOME%\lib\jackson-databind-2.11.0.jar;%CATALINA_HOME%\lib\jackson-core-2.11.0.jar;%CATALINA_HOME%\lib\jackson-annotations-2.11.0.jar;%CATALINA_HOME%\lib\javax.servlet-api-3.1.0.jar;%CATALINA_HOME%\lib\ecj-4.6.1.jar;%CATALINA_HOME%\lib\javax.annotation-api-1.2.jar;%CATALINA_HOME%\lib\tomcat-websocket-9.0.71.jar;%CATALINA_HOME%\lib\javax.websocket-api-1.1.jar;%CATALINA_HOME%\lib\tomcat-catalina-ha-9.0.71.jar;%CATALINA_HOME%\lib\tomcat-tribes-9.0.71.jar"
if not "%CATALINA_HOME%" == "%CATALINA_BASE%" set "CLASSPATH=%CLASSPATH%;%CATALINA_HOME%\bin\amplix_launcher-4.1.0.jar;%CATALINA_HOME%\bin\amplix-4.1.0.jar;%CATALINA_HOME%\lib\slf4j-api-2.0.7.jar;%CATALINA_HOME%\lib\logback-core-1.3.6.jar;%CATALINA_HOME%\lib\logback-classic-1.3.6.jar;%CATALINA_HOME%\lib\tomcat-embed-core-9.0.71.jar;%CATALINA_HOME%\lib\tomcat-annotations-api-9.0.71.jar;%CATALINA_HOME%\lib\tomcat-api-9.0.71.jar;%CATALINA_HOME%\lib\tomcat-el-api-9.0.71.jar;%CATALINA_HOME%\lib\tomcat-embed-core-9.0.71.jar;%CATALINA_HOME%\lib\tomcat-embed-el-9.0.71.jar;%CATALINA_HOME%\lib\tomcat-embed-jasper-9.0.71.jar;%CATALINA_HOME%\lib\tomcat-jasper-9.0.71.jar;%CATALINA_HOME%\lib\tomcat-jasper-el-9.0.71.jar;%CATALINA_HOME%\lib\tomcat-jsp-api-9.0.71.jar;%CATALINA_HOME%\lib\joda-time-2.9.9.jar;%CATALINA_HOME%\lib\commons-codec-1.11.jar;%CATALINA_HOME%\lib\jackson-databind-2.11.0.jar;%CATALINA_HOME%\lib\jackson-core-2.11.0.jar;%CATALINA_HOME%\lib\jackson-annotations-2.11.0.jar;%CATALINA_HOME%\lib\javax.servlet-api-3.1.0.jar;%CATALINA_HOME%\lib\ecj-4.6.1.jar;%CATALINA_HOME%\lib\javax.annotation-api-1.2.jar;%CATALINA_HOME%\lib\tomcat-websocket-9.0.71.jar;%CATALINA_HOME%\lib\javax.websocket-api-1.1.jar;%CATALINA_HOME%\lib\tomcat-catalina-ha-9.0.71.jar;%CATALINA_HOME%\lib\tomcat-tribes-9.0.71.jar"

if "%SERVICE_STARTUP_MODE%" == "" set SERVICE_STARTUP_MODE=manual
if "%JvmMs%" == "" set JvmMs=128
if "%JvmMx%" == "" set JvmMx=256

"%EXECUTABLE%" //IS//%SERVICE_NAME% ^
    --Description "Amplix 5.1 Server - http://amplixbi.com/" ^
    --DisplayName "%DISPLAYNAME%" ^
    --Install "%EXECUTABLE%" ^
    --LogPath "%CATALINA_BASE%\logs" ^
    --StdOutput auto ^
    --StdError auto ^
    --Classpath "%CLASSPATH%" ^
    --Jvm "%JVM%" ^
    --StartMode jvm ^
    --StopMode jvm ^
    --StartPath "%CATALINA_HOME%" ^
    --StopPath "%CATALINA_HOME%" ^
    --StartClass com.amplix.launcher.ServerService ^
    --StopClass com.amplix.launcher.ServerService ^
    --StartParams start ^
    --StopParams stop ^
    --JvmOptions "-DAPP_HOME=%CATALINA_HOME%;-Djava.io.tmpdir=%CATALINA_BASE%\temp;%JvmArgs%" ^
    --JvmOptions9 "--add-opens=java.base/java.lang=ALL-UNNAMED#--add-opens=java.base/java.io=ALL-UNNAMED#--add-opens=java.rmi/sun.rmi.transport=ALL-UNNAMED" ^
    --Startup "%SERVICE_STARTUP_MODE%" ^
    --JvmMs "%JvmMs%" ^
    --JvmMx "%JvmMx%"
if not errorlevel 1 goto installed
echo Failed installing '%SERVICE_NAME%' service
goto end
:installed
echo The service '%SERVICE_NAME%' has been installed.

:end
cd "%CURRENT_DIR%"
