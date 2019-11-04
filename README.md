# AMPLIX BI Distribution Build

Are you frustrated finding valuable information from your data?

Are you hoping for a better solution for your business?

This is community version install files for statistics reports and dashboard visualization solution, AMPLIX BI. To evaluate free cloud instance, please visit [amplixbi.com](https://www.amplixbi.com/).

We provides professional solution and services for your business success:
  * Cloud service or proprietry installation for secure data.
  * No client installation and plugin free.
  * Pivot reporting and office integration.
  * Drag and drop dashboard building.
  * Filter and prompt with searchable meta information.
  * Built in statistics reports compatible with IBM SAS.

### For your business success
  * Microsoft office integration.
  * Oracle eBusinessSuite / SAP ERP.
  * Salesforce and cloud data integration.

### For data scientists
  * ERD with relational databases
  * Statistics on package, Charts, Data visualization
  * Python and R stat integration
  * Decision tree

### For IT team
  * Professional support and consulting services.
  * End user satisfaction with DevOps lifecycle.
  * Easy maintenance, management and self updates for serviceabilty.
  * Reduce development schedule for analysis.
  * Enhance performance with optimizing database processing.
  * Automatic migration of Discoverer Reports.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

This install have server service with embedded Tomcat. You need bellow software installed prior to installation steps.

  * [Java JDK 1.8](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) - Oracle Java JDK 1.8
  * **Web browser** - Full support Web Standards and no plugin installation for developer and end-user.
  * Internet Explorer 9 or higher, Microsoft Edge, Google Chrome, Apple Safari etc.

### Installing

Package installation is easy step on console.
Open command prompt on windows or shell on linux system, and execute following command.

```
cd {APP_HOME}/bin
startup.bat   (or startup.sh on linux)
```

#### Startup options

The installation is automized with command prompt. Complex configuration argument are completed with guided program asks for your input.

```
cd {APP_HOME}/bin

; Install initial metacontents and tables on configured target db
catalina.bat install

; Generates sql scripts to create and initial metacontents with target db
catalina.bat script

; Generates sql scripts to create sample foodmart database
catalina.bat sample_data

Type Yes to continue installation.
```

To use default value, just type enter. To modify value type value in the console and type enter key to continue.

#### Metadatabase configuration
In this step, need to connect on database system using database provider store application data.
The program asks meta database selection. To use local embedded meta database, type **apacheembd**.

##### Prepare meta database
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

Supported database system and type name are as follows:

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


#### Post Installation

Configuration Property file have information necessary to boot application, such as database connection information, and email server settings.
On first installation, run the following command to guided property file setting.

```
	{APP_HOME}/bin/startup.sh install
```

For manual changes on configuation property file, follow steps bellow. Open the following file on VI editor or notepad to edit.

```
	{APP_HOME}/config/amplix.properties 
```
Update `[META_DATABASE]` section with meta database connection information.

On booting time, database connection password, email automatically encrypted and the value changes to starting {ENC} and followed encrypted codes.

## Deployment

You can deploy on Java based web application server such as Tomcat, GlassFish or WebLogic.

## Built With

* [jquery](http://www.jquery.com/) - The web framework used
* [webix](http://www.webix.com/) - The web framework used
* [Maven](https://maven.apache.org/) - Dependency Management
* [Tomcat](http://tomcat.apache.org/) - The web framework used
* [Apache commons](https://commons.apache.org/) - Java library for math, files
* [FasterXML/jackson](https://github.com/FasterXML/jackson) - Dependency Management
* [OpenMarkov](http://www.openmarkov.org) - Opensource Bayesian statistics


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details







