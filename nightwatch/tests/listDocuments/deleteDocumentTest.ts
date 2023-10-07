import "nightwatch-saucelabs-endsauce";
import {
  deleteDocumentById,
  uploadPdfDocument,
} from "../../commands/apiCommonUtility";

describe("Delete document tests", function () {
  this.tags = ["deleteDocument"];
  let listDocumentsPage;
  let deleteDocumentDialog;

  before(async function () {
    await uploadPdfDocument();
    listDocumentsPage = browser.page.listComponent.listDocumentsPage();
    deleteDocumentDialog = listDocumentsPage.section.deleteDocumentDialog;
    await listDocumentsPage.openListComponentPageWithSpecifiedTestClientAndTenantId();
  });

  after(async function () {
    await browser.endSauceAnnotation();
    browser.end();
  });

  test("Delete document via overflow menu", async function () {
    let documentTitle =
      await listDocumentsPage.getDocumentTitleOfRandomAddedDocument();
    await listDocumentsPage.openOverflowMenuForDocumentInTheList(documentTitle);
    listDocumentsPage.assert.visible("@deleteDocumentOverflowMenuButton");
    listDocumentsPage
      .click("@deleteDocumentOverflowMenuButton")
      .waitForElementVisible(deleteDocumentDialog);
    deleteDocumentDialog.assert.visible("@deleteButton");
    deleteDocumentDialog.click("@deleteButton");
    listDocumentsPage
      .waitForElementVisible("@toastNotification")
      .waitForElementNotPresent("@toastNotification", 13000);
    await listDocumentsPage.checkDocumentTitleIsNotPresentInTheDocumentsList(
      documentTitle,
    );
  });

  test("Delete document via overflow menu: cancel action", async function () {
    let documentTitle =
      await listDocumentsPage.getDocumentTitleOfRandomAddedDocument();
    await listDocumentsPage.openOverflowMenuForDocumentInTheList(documentTitle);
    listDocumentsPage.assert.visible("@deleteDocumentOverflowMenuButton");
    listDocumentsPage
      .click("@deleteDocumentOverflowMenuButton")
      .waitForElementVisible(deleteDocumentDialog);
    deleteDocumentDialog.click("@cancelButton");
    await listDocumentsPage.checkDocumentTitlePresentInTheDocumentsList(
      documentTitle,
    );
  });

  test("Document doesnt exist error dialog check when trying to delete a deleted document", async function () {
    let backendErrorDialog =
      browser.page.baseComponent().section.backendErrorDialog;
    let documentTitle =
      await listDocumentsPage.getDocumentTitleOfRandomAddedDocument();
    let documentId =
      await listDocumentsPage.getDocumentIdByDocumentTitle(documentTitle);
    await deleteDocumentById(documentId);
    await listDocumentsPage.openOverflowMenuForDocumentInTheList(documentTitle);
    listDocumentsPage
      .click("@deleteDocumentOverflowMenuButton")
      .waitForElementVisible(deleteDocumentDialog);
    deleteDocumentDialog.click("@deleteButton");
    backendErrorDialog.assert.visible("@dialogTitle");
    await backendErrorDialog.checkDocumentDoesntExistErrorDialogIsCorrect();
    backendErrorDialog.closeErrorDialog();
  });
});
