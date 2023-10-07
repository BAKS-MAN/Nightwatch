import "nightwatch-saucelabs-endsauce";
import {
  checkFileExists,
  getFileNameWithExtensionFromPath,
  getFileNameWithoutExtensionFromPath,
  getTestDocumentPathByType,
} from "../../commands/testDataUtil";

describe("Tests for Upload document component", function () {
  this.tags = ["uploadDocumentModal", "uploadDocument"];
  let uploadDocumentPage;
  let uploadDocumentModal;
  let leaveWithoutSavingDialog;

  before(function () {
    uploadDocumentPage = browser.page.uploadDocument.uploadDocumentPage();
    uploadDocumentModal = browser.page.uploadDocument.uploadDocumentModal();
    leaveWithoutSavingDialog =
      uploadDocumentModal.section.leaveWithoutSavingDialog;
  });

  beforeEach(async function () {
    uploadDocumentPage.openUploadComponentPage();
    await uploadDocumentPage.openUploadModal();
    uploadDocumentModal.waitForElementVisible("@uploadDocumentModal");
    uploadDocumentModal.assert.visible("@uploadDocumentModal");
  });

  afterEach(async function () {
    browser.end();
  });

  test("Check Upload modal elements", function () {
    uploadDocumentModal.verify.visible("@uploadModalHeader");
    uploadDocumentModal.assert.visible("@documentTitleInputField");
    uploadDocumentModal.assert.visible("@uploadComponent");
    uploadDocumentModal.assert.visible("@saveButton");
    uploadDocumentModal.expect
      .element("@saveButton")
      .to.have.property("disabled")
      .equals(true);
  });

  test("Check Document title field is interactive", function () {
    let documentTitleValue = "QA test document";
    uploadDocumentModal.setDocumentTitle(documentTitleValue);
    uploadDocumentModal.assert.attributeEquals(
      "@documentTitleInputField",
      "value",
      documentTitleValue,
    );
  });

  test("Check Document title is required field", function () {
    uploadDocumentModal.setEmptyDocumentTitle();
    uploadDocumentModal.assert.visible("@documentTitleInputError");
  });

  test("Check Document title field with invalid characters", function () {
    uploadDocumentModal.setDocumentTitle("\t");
    uploadDocumentModal.assert.visible("@documentTitleInputError");
  });

  test("Check Leave without saving confirmation dialog: Leave action", function () {
    uploadDocumentModal.setDocumentTitle("Test");
    uploadDocumentModal
      .click("@closeButton")
      .waitForElementPresent(leaveWithoutSavingDialog);
    leaveWithoutSavingDialog.assert.elementPresent("@confirmButton");
    leaveWithoutSavingDialog
      .click("@confirmButton")
      .waitForElementNotPresent("@dialogHeader");
    uploadDocumentModal.assert.not.elementPresent("@uploadDocumentModal");
  });

  test("Check Leave without saving confirmation dialog: Stay action", function () {
    uploadDocumentModal.setDocumentTitle("Test");
    uploadDocumentModal
      .click("@closeButton")
      .waitForElementPresent(leaveWithoutSavingDialog);
    leaveWithoutSavingDialog.assert.elementPresent("@cancelButton");
    leaveWithoutSavingDialog
      .click("@cancelButton")
      .waitForElementNotPresent("@dialogHeader");
    uploadDocumentModal.assert.elementPresent("@uploadDocumentModal");
  });

  test("Add document to the upload form", async function () {
    if (browser.isFirefox()) {
      // Firefox is not supported in tests with Shadow DOM elements;
      return;
    }
    let testDocumentPath = getTestDocumentPathByType("pdf");
    checkFileExists(testDocumentPath);
    await uploadDocumentModal.uploadDocument(testDocumentPath);
    let testDocumentFileName =
      getFileNameWithExtensionFromPath(testDocumentPath);
    let uploadedFileName = await uploadDocumentModal.getUploadedFileName();

    uploadDocumentModal
      .waitForElementVisible(uploadedFileName)
      .expect.element(uploadedFileName)
      .text.to.equal(testDocumentFileName);

    uploadDocumentModal.verify.attributeEquals(
      "@documentTitleInputField",
      "value",
      getFileNameWithoutExtensionFromPath(testDocumentPath),
    );

    uploadDocumentModal.expect
      .element("@saveButton")
      .to.have.property("disabled")
      .equals(false);
  });
});
