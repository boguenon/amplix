# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [4.1.4] - 2020-03-15
### Fixed
- SQL Injection protection enforced to prepared statement for filter values
- Copy and paste in explorer fixed

### Enhancement
- Prompt filter layouting designer
- Prompt default value sets

## [4.1.3] - 2020-03-05
### Added
- Chart : Yaxis logbase scale
- Chart : Yaxis logarithm support
- Chart : Individual series line type attribute
- Chart : Individual Series line width attribute
- Chart : Added Quality Statistics group
- Chart : Added Pareto chart
- Chart : Added Control chart for Quality
- Scheduler : Cancel and purge scheduled running
- Export to excel : Chart image with tabular data options.
- Feature : Statistics Viewer comp. SPSS
- Installer : Loading sample reports and dashboard
- Feature : Meta content editor for developers
- Sample : Six Sigma Quality control examples with semiconductor mfg sample data set. Table name : mfg_qstat

### Fixed
- Analysis : Ranged group custom dimension
- Analysis : Fixed issues on cluster and cluster visualization
- Framework : Tab resizing issues
- Framework : Oversized toolbar with popup button
- Export to pdf : Asian font options
- Export to pdf : Scale down to fix paper
- Scheduler : Fixed issue on loading results with empty or failed events
- Analysis : Formula Measure query generation error fixed

### Enhancement
- Management : License updates by file upload
- Module : Backup and restore meta content
- Module : Data execution module updated to support large query results.
- Export : Added paper size A3, A2, A1, A0

## [4.1.2] - 2020-02-10
### Added
- Start using changelog and applying rules for code maintenance.
- Menu control for save / saveas button
- Docker image installation
- Logging cuddler NLP data process information in metadatabase

### Enhancement
- PDF automization to parse document into data to analysis and transactional purpose
- PDF viewer before downloading file
- PDF template updates to PDFBox library
- Database cache enhanced to daily scheduled refresh
- Download multiple sheets with excel button
- Role management (Adding existing user)
- amplix.properties changes : move most feature to system configuration UI
- single sign on module configuration moved to system configuration

### Removed
- Database register UI changed with removing timeline viewer on right side dock.
- Removed db paging functions (fetch all rows from databases)

### Fixed
- Fixed issue on duplicated names on root folder. Prevents rename and save content with duplicated names on same folder and root folder.
- Fixed issue on performance for loading variables.
- Fixed issue on scheduler.
- Fixed issue on cluster charts when removing cluster dimension
- Drill down between dashboard sheets fixed
- Row count mismatch more than 8000 records

## [4.1.1] - 2020-01-26
### Added
- Added NLP training module and cuddler chat support

## [4.0.1] - 2019-12-31
### Changed
- Apply patch for 4.0.1 version control.

## [3.6.7] -
### Fixed
- Apply patch for bug 3.6.7 share report control

## [3.6.6] -
### Fixed
- Apply patch for bug 3.6.6 manage column reserved for sybase

## [3.6.5] -
### Fixed
- Apply patch for bug 3.6.5 join table schema drop column

## [3.6.4] -
### Fixed
- Apply patch for bug 3.6.4 join information table

## [3.6.3] - 
### Fixed
- Apply patch for bug 3.6.3 user sso module additional column

## [3.6.2] -
### Fixed
- Apply patch for bug 3.6.2 user sso module