import "nightwatch-saucelabs-endsauce";
import { generateUUID } from "../../commands/testDataUtil";
import { expect } from "chai";

describe("Localisation tests for List component", function () {
  this.tags = ["localisation"];
  let listDocumentsPage;

  before(function () {
    listDocumentsPage = browser.page.listComponent.listDocumentsPage();
  });

  beforeEach(function () {
    listDocumentsPage.openListComponentPage();
  });

  afterEach(async function () {
    browser.end();
  });

  test("List component without documents localisation check", async function () {
    listDocumentsPage.setTenantId(generateUUID());
    listDocumentsPage.click("@reloadButton");
    listDocumentsPage.waitForElementPresent("@noDocumentsMessage");
    let noDocumentsMessageInitValue = await listDocumentsPage.getText(
      "@noDocumentsMessage",
    );
    await browser.page.sideMenuComponent().changeLanguage();
    listDocumentsPage.expect
      .element("@noDocumentsMessage")
      .text.not.equals(noDocumentsMessageInitValue);
  });

  test("List component localisation check", async function () {
    let documentTitle =
      await listDocumentsPage.getDocumentTitleOfRandomAddedDocument();
    let addDocumentBtnInitValue = await listDocumentsPage.getElementProperty(
      "@addDocumentButton",
      "innerText",
    );
    let documentAddedLabelInitValue =
      await listDocumentsPage.getDocumentAddedDateLabelText(documentTitle);
    await browser.page.sideMenuComponent().changeLanguage();

    listDocumentsPage.expect
      .element("@addDocumentButton")
      .text.not.equals(addDocumentBtnInitValue);
    listDocumentsPage.expect
      .element("@addDocumentButton")
      .property("innerText")
      .not.equals(addDocumentBtnInitValue);
    expect(
      await listDocumentsPage.getDocumentAddedDateLabelText(documentTitle),
      "Check document added label translation has been changed",
    ).not.equals(documentAddedLabelInitValue);
  });

  test("Localisation check for the overflow menu", async function () {
    let documentTitle =
      await listDocumentsPage.getDocumentTitleOfRandomAddedDocument();
    listDocumentsPage.openOverflowMenuForDocumentInTheList(documentTitle);
    let downloadBtnInitValue =
      await listDocumentsPage.getDownloadButtonLabelText();
    let detailsBtnInitValue =
      await listDocumentsPage.getDetailsButtonLabelText();
    let deleteBtnInitValue = await listDocumentsPage.getDeleteButtonLabelText();

    listDocumentsPage.sendKeys(
      "@deleteDocumentOverflowMenuButton",
      browser.Keys.ESCAPE,
    );
    await browser.page.sideMenuComponent().changeLanguage();

    listDocumentsPage.openOverflowMenuForDocumentInTheList(documentTitle);
    listDocumentsPage.expect
      .element("@downloadDocumentOverflowMenuButton")
      .text.not.equals(downloadBtnInitValue);
    listDocumentsPage.expect
      .element("@documentDetailsOverflowMenuButton")
      .text.not.equals(detailsBtnInitValue);
    listDocumentsPage.expect
      .element("@deleteDocumentOverflowMenuButton")
      .text.not.equals(deleteBtnInitValue);
  });

  test("Localisation check for delete document dialog", async function () {
    let deleteDocumentDialog = listDocumentsPage.section.deleteDocumentDialog;
    let documentTitle =
      await listDocumentsPage.getDocumentTitleOfRandomAddedDocument();
    listDocumentsPage.openOverflowMenuForDocumentInTheList(documentTitle);
    listDocumentsPage.assert.visible("@deleteDocumentOverflowMenuButton");
    listDocumentsPage
      .click("@deleteDocumentOverflowMenuButton")
      .waitForElementVisible(deleteDocumentDialog);

    let dialogHeaderInitValue =
      await deleteDocumentDialog.getText("@dialogHeader");
    let dialogMessageInitValue =
      await deleteDocumentDialog.getText("@dialogMessage");
    let deleteButtonInitValue =
      await deleteDocumentDialog.getDeleteButtonLabelText();
    let cancelButtonInitValue =
      await deleteDocumentDialog.getCancelButtonLabelText();
    deleteDocumentDialog.click("@cancelButton");
    await browser.page.sideMenuComponent().changeLanguage();
    listDocumentsPage.openOverflowMenuForDocumentInTheList(documentTitle);
    listDocumentsPage
      .click("@deleteDocumentOverflowMenuButton")
      .waitForElementVisible(deleteDocumentDialog);

    deleteDocumentDialog.expect
      .element("@dialogHeader")
      .text.not.equals(dialogHeaderInitValue);
    deleteDocumentDialog.expect
      .element("@dialogMessage")
      .text.not.equals(dialogMessageInitValue);
    expect(
      await deleteDocumentDialog.getDeleteButtonLabelText(),
      "Check delete button in the delete document dialog has been translated",
    ).not.equals(deleteButtonInitValue);
    expect(
      await deleteDocumentDialog.getCancelButtonLabelText(),
      "Check cancel button in the delete document dialog has been translated",
    ).not.equals(cancelButtonInitValue);
  });
});
