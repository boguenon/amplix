# AMPLIX BI Distribution Build

This is community version install files for statistics reports and dashboard visualization solution, AMPLIX BI. To evaluate free cloud instance, please visit [amplixbi.com](https://www.amplixbi.com/).

The main characterastic and benefits are as follows:

  * Cloud service or proprietry installation for secure data
  * No client installation and plugin free
  * Pivot reporting and dashboard build with easy drag and drop
  * 

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites



```
Give examples
```

### Installing

A step by step series of examples that tell you how to get a development env running

Say what the step will be

```
Give the example
```

Package installation is easy step on console.
Open command prompt on windows or shell on linux system, and execute following command.

```
cd {APP_HOME}/bin
startup.bat   (or startup.sh on linux)
```

### Startup options

```
cd {APP_HOME}/bin
; Install initial metacontents and tables on configured target db
catalina.bat install
; Generates sql scripts to create and initial metacontents with target db
catalina.bat script
; Generates sql scripts to create sample foodmart database
catalina.bat sample_data
```

Type Yes to continue installation.

To use default value, just type enter. To modify value type value in the console and type enter key to continue.

The program asks meta database selection. To use local embedded meta database, type apacheembd.

### Metadatabase configuration

In this step, need to connect on database system using database provider supported client tool. The following example is based on MySQL.

#### Prepare meta database
Open MySQL command prompt and execute following command to connect to database system.

```
mysql -uroot -p -hlocalhost
```

After connecting to database execute following DDL script to create database.
```
CREATE DATABASE amplix DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
```

The interactive prompt will ask the following criteria to generate files:
```
{APP_HOME}/bin/catalina.bat script

database type (mysql,oracle,mssql,apacheembd,postgresql)>>
-> Check below database type mapping information to shortcur name of database type
SQL script filename : [meta.sql] >>
-> Enter file name to be created
Password: >>
-> Password of the admin user for the application login
```

Database type mapping information
|Database name|Type name|Notes|
| ----------- | ------- | --- |
|oracle|oracle| |
|ApacheEmbedded|apacheembd| |
|IBM DB2|db2| |
|IBM AS400|db2| |
|MySQL|mysql| |
|Postre SQL|postg / postgresql / postgre| |
|MS SQL|mssql| |
|Tibero DB|tibero| |
|Sybase ASE|sybase_ase| |


Configuration Property file
have information necessary to boot application. This information includes database connection information, and email server settings.
Automatic configuration file updates. On first installation, run the following command to guided property file setting.
```
	{APP_HOME}/bin/startup.sh install
```
For manual changes on configuation property file, follow steps bellow. Open the following file on VI editor or notepad to edit.

```
	{APP_HOME}/config/amplix.properties 
```
Update `[META_DATABASE]` section with meta database connection information.

On booting time, database connection password, email automatically encrypted and the value changes to starting {ENC} and followed encrypted codes. This protects and secure important database configuration information from leaking outside.

## Deployment

You can deploy on Java based web application server such as Tomcat, GlassFish or WebLogic.

## Built With

* [jquery](http://www.jquery.com/) - The web framework used
* [webix](http://www.webix.com/) - The web framework used
* [Maven](https://maven.apache.org/) - Dependency Management
* [Tomcat](http://tomcat.apache.org/) - The web framework used
* [Apache commons] (https://commons.apache.org/) - Java library for math, files
* [FasterXML/jackson] (https://github.com/FasterXML/jackson) - Dependency Management
* [OpenMarkov] (http://www.openmarkov.org) - Opensource Bayesian statistics

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details







