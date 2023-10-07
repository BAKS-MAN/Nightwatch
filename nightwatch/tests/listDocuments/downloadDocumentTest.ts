import "nightwatch-saucelabs-endsauce";
import {
  cleanupDownloadFolder,
  getPdfFileNameWithExtension,
} from "../../commands/testDataUtil";
import { assert } from "chai";
import "@nightwatch/apitesting";
import {
  deleteDocumentById,
  uploadPdfDocument,
} from "../../commands/apiCommonUtility";

describe("Download document tests", function () {
  this.tags = ["downloadDocument", "E2E"];
  let listDocumentsPage;
  let documentTitle: string;

  before(async function () {
    await uploadPdfDocument();
    listDocumentsPage = browser.page.listComponent.listDocumentsPage();
  });

  beforeEach(async function () {
    await listDocumentsPage.openListComponentPageWithSpecifiedTestClientAndTenantId();
    documentTitle =
      await listDocumentsPage.getDocumentTitleOfRandomAddedDocument();
  });

  after(function () {
    if (browser.isChrome()) {
      cleanupDownloadFolder();
    }
  });

  afterEach(async function () {
    await browser.endSauceAnnotation();
    browser.end();
  });

  test("Download document via overflow menu", async function () {
    await listDocumentsPage.openOverflowMenuForDocumentInTheList(documentTitle);
    listDocumentsPage.assert
      .visible("@downloadDocumentOverflowMenuButton")
      .click("@downloadDocumentOverflowMenuButton");
    listDocumentsPage.waitForElementVisible("@toastNotification");
    if (browser.isChrome() && browser.globals.env != "chrome.headless") {
      let chromeDownloadsPage = browser.page.chrome.chromeDownloadsPage();
      chromeDownloadsPage.navigate();
      await chromeDownloadsPage.checkDownloadListIsNotEmpty();
      assert.equal(
        await chromeDownloadsPage.getDownloadedFileName(),
        getPdfFileNameWithExtension(),
        "Check downloaded document file name equals to test file",
      );
    }
  });

  test("Document doesnt exist error dialog check when trying to download a deleted document", async function () {
    let backendErrorDialog =
      browser.page.baseComponent().section.backendErrorDialog;
    let documentId =
      await listDocumentsPage.getDocumentIdByDocumentTitle(documentTitle);
    await deleteDocumentById(documentId);
    await listDocumentsPage.openOverflowMenuForDocumentInTheList(documentTitle);
    listDocumentsPage.assert
      .visible("@downloadDocumentOverflowMenuButton")
      .click("@downloadDocumentOverflowMenuButton");
    backendErrorDialog.assert.visible("@dialogTitle");
    await backendErrorDialog.checkDocumentDoesntExistErrorDialogIsCorrect();
    backendErrorDialog.closeErrorDialog();
  });
});
