# Nightwatch.js demo project for UI testing of a document platform component.

## [Nightwatch.js Documentation](https://nightwatchjs.org/guide/overview/)

Nightwatch.js is an integrated framework for performing automated end-to-end testing on web
applications and websites, across all major browsers. It is written in Node.js and uses the W3C
WebDriver API to interact with various browsers.

# How to install

- Clone the repository
- Install local dependencies using: `npm install`

## **Working with Test Environments**

The framework has two test environments: `local` and `sauce`.</br>
The environments are located under the "**test_settings**" dictionary in the configuration file.
A **default** environment is always required from which the other environments inherit the settings.
You can overwrite any test setting for each environment as needed.

## **Executing the tests**

_First install the TypeScript compiler globally to allow for easy access to `tsc` in the command
line_
`sudo npm install -g typescript`

- **Run tests `locally`**
    - To run all tests using `Chrome`:
      <pre>npm run test:local</pre>
    - To run all tests using specified browser (chrome, firefox, safari, edge):
      <pre> npx nightwatch --env firefox</pre>
    - To run only accessibility tests:
      <pre> npm run accessibility</pre>

- **Run tests on `SauceLabs`**
    - To run all tests across all browsers (chrome, firefox, safari, edge):
      <pre>npm run test</pre>

**Generating HTML report**
Nightwatch generates html report under **tests_output** folder

