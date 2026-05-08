# Playwright Test Automation Framework
This repository contains an end-to-end UI automation framework built with Playwright.
The framework supports cross-browser testing, environment-based execution, tag-based test filtering, and reporting using Allure Report. Additional reports generated is Monocart-reporter and Junit reporter.

# Framework Features
| **Feature**           | **Description**                                              |
| --------------------- | ------------------------------------------------------------ |
| Cross Browser Testing | Execute tests across multiple browsers                       |
| Environment Handling  | Run tests against different environments (test, qa, staging) |
| Tag Based Execution   | Run specific test groups like smoke, regression, sanity      |
| Page Object Model     | Maintainable and scalable test structure                     |
| Parallel Execution    | Faster test execution                                        |
| Allure Reporting      | Rich interactive reports with screenshots and logs           |
| CI/CD Friendly        | Easily integrated with pipelines                             |

# Tech Stack
| Technology    | Purpose                       |
| ------------- | ----------------------------- |
| Playwright    | Browser automation framework  |
| Node.js       | Runtime environment           |
| TypeScript    | Programming language          |
| Allure Report | Test reporting                |
| cross-env     | Environment variable handling |

# Framework Capabilities
## 1. Cross Browser Testing
The framework supports execution on the following browsers:
 - Chrome
 - Edge
 - Firefox

Browser selection is controlled using the BROWSERS environment variable.

**Example:**
| **Variable**                   | **Description**                        |
| ------------------------------ | -------------------------------------- |
| `BROWSERS=chrome`              | Run tests on Chrome                    |
| `BROWSERS=chrome,edge`         | Run tests on Chrome and Edge           |
| `BROWSERS=chrome,edge,firefox` | Run tests on Chrome, Edge, and Firefox |

The framework dynamically initializes browser instances based on the provided configuration.

## 2. Environment Handling
Tests can be executed across multiple environments such as:
 - test
 - dev

Environment selection is controlled using the ENV variable.
**Example:**
| **Variable**  | **Description**                       |
| ------------- | ------------------------------------- |
| `ENV=test`    | Run tests against test environment    |
| `ENV=qa`      | Run tests against QA environment      |
| `ENV=staging` | Run tests against staging environment |

Environment-specific configuration such as:
 - Base URLs
 - Credentials
 - API endpoints
are loaded dynamically from the configuration files.

## 3. Tag Based Test Execution
Tests are categorized using tags such as:
 - @smoke
 - @regression
 - @sanity

**Example:**
test('Verify user login @smoke', async ({ page }) => {
});

**Benefits of Tagging:**
 - Execute critical tests quickly
 - Run regression suites
 - Exclude specific test groups
 - Enable targeted test execution

Tag filtering is implemented using Playwright options:
 - `--grep`
 - `--grep-invert`

## 4. Test Execution Commands
Below are predefined commands used to execute tests with different configurations.
### 4.1 Run Smoke Tests on Chrome
| **Parameter**| **Value**  |
| ------------ | ---------- |
| Environment  | test       |
| Browser      | Chrome     |
| Tags         | @smoke     |

**Command:**
`npx cross-env ENV=test BROWSERS=chrome npx playwright test --grep '@smoke' --config=configs\tests.config.ts && allure generate allure-results --clean -o allure-report`

**Purpose:**
- Sets environment as test
- Runs tests on Chrome
- Executes tests tagged @smoke
- Generates Allure report

### 4.2 Run Smoke OR Regression Tests on Chrome and Edge
| **Parameter**  | **Value**             |
| -------------- | --------------------- |
| Environment    | test                  |
| Browsers       | Chrome, Edge          |
| Tags           | @smoke OR @regression |
| Excluded       | @sanity               |

**Command:**
`npx cross-env ENV=test BROWSERS=chrome,edge npx playwright test --grep "@smoke^|@regression" --grep-invert '@sanity' --config=configs\tests.config.ts && allure generate allure-results --clean -o allure-report`

**Purpose:**
- Executes tests tagged @smoke OR @regression
- Excludes tests tagged @sanity
- Runs on Chrome and Edge
- Generates Allure report

### 4.3 Run Tests Tagged with Smoke AND Regression
| Parameter   | Value                  |
| ----------- | ---------------------- |
| Environment | test                   |
| Browsers    | Chrome, Edge, Firefox  |
| Tags        | @smoke AND @regression |

**Command:**
`npx cross-env ENV=test BROWSERS=chrome,edge,firefox npx playwright test --grep "(?=.*@smoke)(?=.*@regression)" --config=configs\tests.config.ts && allure generate allure-results --clean -o allure-report`

**Purpose:**
- Runs tests containing both tags in AND condition, @smoke AND @regression
- Executes on Chrome, Edge, and Firefox
- Generates Allure report

## 5. Test Reporting
The framework integrates with Allure Report to generate interactive reports.
The report provides:
- Test execution summary
- Pass/Fail statistics
- Test steps
- Screenshots on failure
- Execution timeline
- Logs and attachments
After test execution, the report is generated using:
`allure generate allure-results --clean -o allure-report`

 ### 5. 1 Opening the Allure Report
 To view the report, execute: `allure open allure-report`
 
**Why This Command Is Required?**

Allure reports contain dynamic HTML resources and scripts that require a local web server to render correctly.
 The command allure open launches a temporary local server and opens the report in the browser with all resources loaded properly.

# Installation
Step 1 — Clone Repository : `git clone <repository-url>`

Step 2 — Install Dependencies: `npm install`

Step 3 — Install Playwright Browsers: `npx playwright install`

# Best Practices
- Use tags for test categorization
- Follow Page Object Model design pattern
- Avoid hardcoded test data
- Use environment configuration files
- Keep tests independent and reusable
- Capture screenshots and logs for failures










