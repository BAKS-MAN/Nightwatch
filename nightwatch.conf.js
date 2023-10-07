// Refer to the online docs for more details:
// https://nightwatchjs.org/gettingstarted/configuration/
//

//  _   _  _         _      _                     _          _
// | \ | |(_)       | |    | |                   | |        | |
// |  \| | _   __ _ | |__  | |_ __      __  __ _ | |_   ___ | |__
// | . ` || | / _` || '_ \ | __|\ \ /\ / / / _` || __| / __|| '_ \
// | |\  || || (_| || | | || |_  \ V  V / | (_| || |_ | (__ | | | |
// \_| \_/|_| \__, ||_| |_| \__|  \_/\_/   \__,_| \__| \___||_| |_|
//             __/ |
//            |___/

const Services = {};
const downloadPath = require("path").resolve(__dirname + "/download");

function loadServices() {
  try {
    Services.chromedriverPath =
      process.env.CHROMEDRIVER_PATH || require("chromedriver").path;
  } catch (err) {
    console.error(err);
  }
}

loadServices();

module.exports = {
  // An array of folders (excluding subfolders) where your tests are located;
  // if this is not specified, the test source must be passed as the second argument to the test runner.
  src_folders: ["nightwatch/tests"],

  // See https://nightwatchjs.org/guide/concepts/page-object-model.html
  page_objects_path: ["nightwatch/pages"],

  // See https://nightwatchjs.org/guide/extending-nightwatch/adding-custom-commands.html
  custom_commands_path: ["nightwatch/commands"],

  // See https://nightwatchjs.org/guide/extending-nightwatch/adding-custom-assertions.html
  custom_assertions_path: [],

  // See https://nightwatchjs.org/guide/extending-nightwatch/adding-plugins.html
  plugins: [],

  // See https://nightwatchjs.org/guide/concepts/test-globals.html
  globals_path: "",

  webdriver: {},

  test_workers: {
    enabled: true,
  },

  globals: {
    /* controls the timeout value for async hooks.
    Expects the done() callback to be invoked within this time or an error is thrown
    QA: if sum of await intervals during a test exceeds defined value
    then test is defined as failed although all checks passed
     */
    asyncHookTimeout: 40000,
  },

  test_settings: {
    default: {
      disable_error_log: false,
      launch_url: "http://localhost",

      screenshots: {
        enabled: false,
        path: "screens",
        on_failure: true,
      },

      desiredCapabilities: {
        browserName: "chrome",
        javascriptEnabled: true,
        acceptSslCerts: true,
        chromeOptions: {
          prefs: {
            download: {
              default_directory: downloadPath,
            },
          },
        },
      },

      webdriver: {
        start_process: true,
        server_path: "",
      },
      globals: {
        base_url: "https://dp.test.int",
        tenantId: "5f1c9474-d80b-4839-be5a-710d19e67284",
        tenantId_no_documents: "0444a286-a816-4797-a4e9-a222dfb4d167",
        tenantId_no_userId: "c81e60eb-0f0e-45fd-a28d-d95020632735",
        clientId: "5f1c9474-d80b-4839-be5a-710d19e67284",
        categoryId: "26030366-5699-499a-ad2c-503029dc973b",
      },
    },

    safari: {
      desiredCapabilities: {
        browserName: "safari",
        alwaysMatch: {
          acceptInsecureCerts: false,
        },
      },
      webdriver: {
        start_process: true,
        server_path: "",
      },
    },

    firefox: {
      desiredCapabilities: {
        browserName: "firefox",
        alwaysMatch: {
          acceptInsecureCerts: true,
          "moz:firefoxOptions": {
            args: [
              // '-headless',
              // '-verbose'
            ],
          },
        },
      },
      webdriver: {
        start_process: true,
        server_path: "",
        cli_args: [
          // very verbose geckodriver logs
          // '-vv'
        ],
      },
    },

    chrome: {
      desiredCapabilities: {
        browserName: "chrome",
        "goog:chromeOptions": {
          // More info on Chromedriver: https://sites.google.com/a/chromium.org/chromedriver/
          //
          // w3c:false tells Chromedriver to run using the legacy JSONWire protocol (not required in Chrome 78)
          w3c: true,
          args: [
            //'--no-sandbox',
            //'--ignore-certificate-errors',
            //'--allow-insecure-localhost',
            //'--headless'
          ],
        },
      },

      webdriver: {
        start_process: true,
        server_path: "",
        cli_args: [
          // --verbose
        ],
      },
    },

    "chrome.headless": {
      globals: {
        env: "chrome.headless",
      },
      test_workers: {
        enabled: false,
        workers: 2,
      },
      desiredCapabilities: {
        browserName: "chrome",
        "goog:chromeOptions": {
          prefs: {
            download: {
              default_directory: downloadPath,
            },
          },
          // More info on Chromedriver: https://sites.google.com/a/chromium.org/chromedriver/
          //
          // w3c:false tells Chromedriver to run using the legacy JSONWire protocol (not required in Chrome 78)
          w3c: true,
          args: [
            "no-sandbox",
            "disable-dev-shm-usage",
            "disable-gpu",
            "ignore-certificate-errors",
            // "allow-insecure-localhost",
            "window-size=1920,1080",
            "headless",
          ],
        },
      },

      webdriver: {
        start_process: true,
        server_path: Services.chromedriverPath,
        port: 9516,
        host: "localhost",
        ssl: false,
        default_path_prefix: "",
        proxy: undefined,
        cli_args: ["--port=9516"],
      },
    },
  },
};
