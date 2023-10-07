import "nightwatch-saucelabs-endsauce";

describe("Tests for list component", function () {
  this.tags = ["listComponent"];
  let listDocumentsPage;
  let backendErrorDialog;

  before(function () {
    listDocumentsPage = browser.page.listComponent.listDocumentsPage();
    backendErrorDialog =
      browser.page.baseComponent().section.backendErrorDialog;
  });

  beforeEach(function () {
    listDocumentsPage.openListComponentPage();
  });

  afterEach(async function () {
    await browser.endSauceAnnotation();
    browser.end();
  });

  test("Check 'Add a Document' button on the list component", function () {
    listDocumentsPage.assert.visible("@addDocumentButton");
    listDocumentsPage.click("@addDocumentButton");
    browser.page.uploadDocument
      .uploadDocumentModal()
      .verify.visible("@uploadModalHeader");
  });

  test("Disable 'Add a Document' button on the list component", function () {
    listDocumentsPage.assert.visible("@addDocumentButtonVisibilityCheckbox");
    listDocumentsPage.click("@addDocumentButtonVisibilityCheckbox");
    listDocumentsPage.click("@reloadButton");
    listDocumentsPage.assert.not.elementPresent("@addDocumentButton");
  });

  test('Check "Add document" button is displayed for empty documents list', async function () {
    listDocumentsPage.reloadComponentWithSpecifiedTenantIdAndClientId(
      browser.globals.tenantId_no_documents,
      browser.globals.clientId,
    );
    await listDocumentsPage.assert.visible(
      "@noDocumentsMessage",
      "No document for empty tenantID",
    );
    listDocumentsPage.assert.visible("@addDocumentButton");
  });

  test("Authentication error dialog check for the Upload component using mocked tenant id without user id", async function () {
    listDocumentsPage.reloadComponentWithSpecifiedTenantIdAndClientId(
      browser.globals.tenantId_no_userId,
      browser.globals.clientId,
    );
    backendErrorDialog.assert.visible("@dialogTitle");
    await backendErrorDialog.checkAuthenticationErrorDialogIsCorrect();
    backendErrorDialog.closeErrorDialog();
  });
});
