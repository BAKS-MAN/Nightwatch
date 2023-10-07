import "nightwatch-saucelabs-endsauce";
import { generateUUID } from "../../commands/testDataUtil";
import { expect } from "chai";

describe("Localisation tests for Upload document component", function () {
  this.tags = ["localisation"];

  let listDocumentsPage;
  let uploadDocumentPage;
  let uploadDocumentModal;
  let backendErrorDialog;
  let editDocumentTitleElement;
  let leaveWithoutSavingDialog;

  before(function () {
    listDocumentsPage = browser.page.listComponent.listDocumentsPage();
    uploadDocumentPage = browser.page.uploadDocument.uploadDocumentPage();
    uploadDocumentModal = browser.page.uploadDocument.uploadDocumentModal();
    backendErrorDialog =
      browser.page.baseComponent().section.backendErrorDialog;
    editDocumentTitleElement =
      browser.page.baseComponent().section.documentTitleElement;
    leaveWithoutSavingDialog =
      browser.page.baseComponent().section.leaveWithoutSavingDialog;
  });

  beforeEach(function () {
    listDocumentsPage.openListComponentPage();
    listDocumentsPage.click("@addDocumentButton");
  });

  afterEach(async function () {
    await browser.endSauceAnnotation();
    browser.end();
  });

  test("Localisation check for Upload component", async function () {
    uploadDocumentModal.waitForElementPresent("@saveButton");
    let uploadModalHeaderInitValue =
      await uploadDocumentModal.getText("@uploadModalHeader");
    let uploadModalTitleInitValue =
      await uploadDocumentModal.getText("@uploadModalTitle");
    let uploadFileSizeLabelInitValue = await uploadDocumentModal.getText(
      "@uploadFileSizeLabel",
    );
    let documentTitleInputFieldLabelInitValue =
      await editDocumentTitleElement.getText("@documentTitleInputFieldLabel");
    let saveButtonInitValue = await uploadDocumentModal.getElementProperty(
      "@saveButton",
      "innerText",
    );
    await uploadDocumentModal.closeModalWithoutSaving();
    await browser.page.sideMenuComponent().changeLanguage();
    listDocumentsPage.click("@addDocumentButton");

    uploadDocumentModal.expect
      .element("@uploadModalHeader")
      .text.not.equals(uploadModalHeaderInitValue);
    uploadDocumentModal.expect
      .element("@uploadModalTitle")
      .text.not.equals(uploadModalTitleInitValue);
    uploadDocumentModal.expect
      .element("@uploadFileSizeLabel")
      .text.not.equals(uploadFileSizeLabelInitValue);
    editDocumentTitleElement.expect
      .element("@documentTitleInputFieldLabel")
      .text.not.equals(documentTitleInputFieldLabelInitValue);
    uploadDocumentModal.expect
      .element("@saveButton")
      .property("innerText")
      .not.equals(saveButtonInitValue);
  });

  test("Localisation check for Document title input error message: required field", async function () {
    editDocumentTitleElement.setEmptyDocumentTitle();
    editDocumentTitleElement.waitForElementPresent("@documentTitleInputError");
    let documentTitleInputErrorInitValue =
      await editDocumentTitleElement.getDocumentTitleInputErrorText();
    await uploadDocumentModal.closeModalWithoutSaving();
    await browser.page.sideMenuComponent().changeLanguage();
    listDocumentsPage.click("@addDocumentButton");
    editDocumentTitleElement.setEmptyDocumentTitle();
    editDocumentTitleElement.waitForElementPresent("@documentTitleInputError");
    expect(
      await editDocumentTitleElement.getDocumentTitleInputErrorText(),
      "Check document title input required error text has been translated",
    ).not.equals(documentTitleInputErrorInitValue);
  });

  test("Localisation check for Document title input error message: invalid characters", async function () {
    editDocumentTitleElement.setDocumentTitle("\t");
    editDocumentTitleElement.waitForElementPresent("@documentTitleInputError");
    let documentTitleInputErrorInitValue =
      await editDocumentTitleElement.getDocumentTitleInputErrorText();
    await uploadDocumentModal.closeModalWithoutSaving();
    await browser.page.sideMenuComponent().changeLanguage();
    listDocumentsPage.click("@addDocumentButton");
    editDocumentTitleElement.setDocumentTitle("\t");
    editDocumentTitleElement.waitForElementPresent("@documentTitleInputError");
    expect(
      await editDocumentTitleElement.getDocumentTitleInputErrorText(),
      "Check document title invalid characters input error text has been translated",
    ).not.equals(documentTitleInputErrorInitValue);
  });

  test("Localisation check for Leave without saving confirmation dialog", async function () {
    editDocumentTitleElement.setDocumentTitle("Test");
    uploadDocumentModal
      .click("@closeButton")
      .waitForElementPresent(leaveWithoutSavingDialog);
    let dialogTitleInitValue =
      await leaveWithoutSavingDialog.getText("@dialogTitle");
    let dialogMessageInitValue =
      await leaveWithoutSavingDialog.getText("@dialogMessage");
    let confirmButtonInitValue =
      await leaveWithoutSavingDialog.getConfirmButtonLabelText();
    let cancelButtonInitValue =
      await leaveWithoutSavingDialog.getCancelButtonLabelText();
    leaveWithoutSavingDialog
      .click("@confirmButton")
      .waitForElementNotPresent("@dialogTitle");
    await browser.page.sideMenuComponent().changeLanguage();
    listDocumentsPage.click("@addDocumentButton");
    editDocumentTitleElement.setDocumentTitle("Test");
    uploadDocumentModal.click("@closeButton");
    leaveWithoutSavingDialog.waitForElementPresent("@dialogTitle");
    leaveWithoutSavingDialog.expect
      .element("@dialogTitle")
      .text.not.equals(dialogTitleInitValue);
    leaveWithoutSavingDialog.expect
      .element("@dialogMessage")
      .text.not.equals(dialogMessageInitValue);
    expect(
      await leaveWithoutSavingDialog.getConfirmButtonLabelText(),
      "Check confirmation button in the Leave without saving confirmation dialog has been translated",
    ).not.equals(confirmButtonInitValue);
    expect(
      await leaveWithoutSavingDialog.getCancelButtonLabelText(),
      "Check cancel button in the Leave without saving confirmation dialog has been translated",
    ).not.equals(cancelButtonInitValue);
  });

  test("Localisation check for Authentication error dialog", async function () {
    if (browser.isFirefox()) {
      // Firefox is not supported in tests with Shadow DOM elements;
      return;
    }
    uploadDocumentPage.openUploadComponentPage();
    uploadDocumentPage.setTenantId(generateUUID());
    await checkBackendErrorDialogLocale();
  });

  test("Localisation check for Something went wrong error dialog", async function () {
    if (browser.isFirefox()) {
      // Firefox is not supported in tests with Shadow DOM elements;
      return;
    }
    uploadDocumentPage.openUploadComponentPage();
    uploadDocumentPage.setCategoryId(generateUUID());
    await checkBackendErrorDialogLocale();
  });

  async function checkBackendErrorDialogLocale() {
    uploadDocumentPage.click("@uploadDocumentButton");
    await uploadDocumentModal.addPdfFileWithTimeStampTitle();
    uploadDocumentModal.click("@saveButton");
    backendErrorDialog.assert.visible("@dialogTitle");
    let dialogTitleInitValue = await backendErrorDialog.getText("@dialogTitle");
    let dialogMessageInitValue =
      await backendErrorDialog.getText("@dialogMessage");
    backendErrorDialog.closeErrorDialog();
    await uploadDocumentModal.closeModalWithoutSaving();
    await browser.page.sideMenuComponent().changeLanguage();
    uploadDocumentPage.click("@uploadDocumentButton");
    await uploadDocumentModal.addPdfFileWithTimeStampTitle();
    uploadDocumentModal.click("@saveButton");
    backendErrorDialog.assert.visible("@dialogTitle");
    backendErrorDialog.expect
      .element("@dialogTitle")
      .text.not.equals(dialogTitleInitValue);
    backendErrorDialog.expect
      .element("@dialogMessage")
      .text.not.equals(dialogMessageInitValue);
  }
});
