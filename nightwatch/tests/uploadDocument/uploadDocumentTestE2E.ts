import "nightwatch-saucelabs-endsauce";
import { generateUUID } from "../../commands/testDataUtil";

describe("E2E for Upload document component", function () {
  this.tags = ["uploadDocument", "E2E"];
  let uploadDocumentPage;
  let uploadDocumentModal;
  let listDocumentsPage;
  let backendErrorDialog;

  before(async function () {
    listDocumentsPage = browser.page.listComponent.listDocumentsPage();
    uploadDocumentPage = browser.page.uploadDocument.uploadDocumentPage();
    uploadDocumentModal = browser.page.uploadDocument.uploadDocumentModal();
    backendErrorDialog =
      browser.page.baseComponent().section.backendErrorDialog;
  });

  beforeEach(async function () {
    uploadDocumentPage.openUploadComponentPage();
  });

  afterEach(async function () {
    await browser.endSauceAnnotation();
    browser.end();
  });

  test("Add a Document with specified tenantID, ClientId and check it on the list component", async function () {
    if (browser.isFirefox()) {
      // Firefox is not supported in tests with Shadow DOM elements;
      return;
    }
    await uploadDocumentPage.setTestTenantIdClientIdCategoryId();
    await uploadDocumentPage.openUploadModal();
    let documentTitle =
      await uploadDocumentModal.addPdfFileWithTimeStampTitle();
    uploadDocumentModal.click("@saveButton");
    uploadDocumentModal.waitForElementVisible("@toastNotification");
    await listDocumentsPage.openListComponentPageWithSpecifiedTestClientAndTenantId();
    await listDocumentsPage.checkDocumentTitlePresentInTheDocumentsList(
      documentTitle,
    );
  });

  test("Authentication error dialog check for the Upload component using mocked tenant id without user id", async function () {
    if (browser.isFirefox()) {
      // Firefox is not supported in tests with Shadow DOM elements;
      return;
    }
    uploadDocumentPage.setTenantId(browser.globals.tenantId_no_userId);
    await uploadDocumentPage.openUploadModal();
    await uploadDocumentModal.addPdfFileWithTimeStampTitle();
    uploadDocumentModal.click("@saveButton");
    backendErrorDialog.assert.visible("@dialogTitle");
    await backendErrorDialog.checkAuthenticationErrorDialogIsCorrect();
    backendErrorDialog.closeErrorDialog();
  });

  test("Something went wrong error dialog check for the Upload component using non-existing category id", async function () {
    if (browser.isFirefox()) {
      // Firefox is not supported in tests with Shadow DOM elements;
      return;
    }
    uploadDocumentPage.setCategoryId(generateUUID());
    await uploadDocumentPage.openUploadModal();
    await uploadDocumentModal.addPdfFileWithTimeStampTitle();
    uploadDocumentModal.click("@saveButton");
    backendErrorDialog.assert.visible("@dialogTitle");
    await backendErrorDialog.checkSomethingWentWrongErrorDialogIsCorrect();
    backendErrorDialog.closeErrorDialog();
  });
});
