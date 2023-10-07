import { getRandomInt } from "../../commands/testDataUtil";
import { uploadPdfDocument } from "../../commands/apiCommonUtility";

const listDocumentsCommands = {
  openListComponentPage() {
    this.navigate().waitForElementVisible("@listComponent", 20000);
  },

  async openListComponentPageWithSpecifiedTestClientAndTenantId() {
    this.openListComponentPage();
    await this.setClientId(browser.globals.clientId);
    await this.setTenantId(browser.globals.tenantId);
    this.click("@reloadButton");
    await this.waitForElementVisible("@aqaDocument", 20000);
    this.assert.visible(
      "@documentsList",
      "Check list of documents is displayed on the list component for specified QA clientId and tenantId",
    );
  },

  async openOverflowMenuForDocumentInTheList(documentTitle: string) {
    await this.click({
      selector: `//*[.='${documentTitle}']/../..//-button[contains(@id, 'list-menu')]`,
      locateStrategy: "xpath",
    });
    this.waitForElementVisible("@overflowMenu");
  },

  async getDocumentTitleOfRandomAddedDocument() {
    this.assert.visible(
      "@addedDocumentTitle",
      "Check document without an error label is present in the documents list",
    );
    let documentWebElements = await this.element.findAll("@addedDocumentTitle");
    console.log(
      "Quantity of documents in the list: ",
      documentWebElements.length,
    );
    let foundDocumentTitle = await documentWebElements
      .at(getRandomInt(documentWebElements.length))
      .getText();
    console.log("Randomly selected document title: ", foundDocumentTitle);
    return foundDocumentTitle;
  },

  async preparePdfDocument() {
    let documentWebElements = await this.element.findAll("@pdfDocumentTitle");
    if (documentWebElements.length == 0) {
      await uploadPdfDocument();
    }
  },

  async getDocumentTitleOfRandomPdfDocument() {
    this.assert.visible(
      "@pdfDocumentTitle",
      "Check document with PDF icon is present in the documents list",
    );
    let documentWebElements = await this.element.findAll("@pdfDocumentTitle");
    console.log(
      "Quantity of pdf documents in the list: ",
      documentWebElements.length,
    );
    let foundDocumentTitle = await documentWebElements
      .at(getRandomInt(documentWebElements.length))
      .getText();
    console.log("Randomly selected pdf document title: ", foundDocumentTitle);
    return foundDocumentTitle;
  },

  async getDocumentAddedDateLabelValue(documentTitle: string) {
    await this.waitForElementVisible("@aqaDocument", 5000);
    return await this.getElementProperty(
      {
        selector: `//*[.='${documentTitle}']/../p[@class='-line-secondary']`,
        locateStrategy: "xpath",
      },
      "innerText",
    );
  },

  async getDocumentAddedDateLabelText(documentTitle: string) {
    await this.waitForElementVisible("@aqaDocument", 5000);
    let documentAddedDateLabelText: string =
      await this.getDocumentAddedDateLabelValue(documentTitle);
    return documentAddedDateLabelText.split(" ")[0];
  },

  async getDocumentAddedDateVale(documentTitle: string) {
    await this.waitForElementVisible("@aqaDocument", 5000);
    let documentAddedDateLabelText: string =
      await this.getDocumentAddedDateLabelValue(documentTitle);
    return documentAddedDateLabelText.split(" ")[1];
  },

  async getDocumentIdByDocumentTitle(documentTitle: string) {
    /* Document item on the UI has document id stored in property "id"
    with prefix "-dplist-document-item-" so we need to get this id value and remove prefix
     */
    let documentId: string = await this.getElementProperty(
      {
        selector: `//*[.='${documentTitle}']/ancestor::-list-item`,
        locateStrategy: "xpath",
      },
      "id",
    );
    let prefix = "-dplist-document-item-";
    return documentId.slice(documentId.indexOf(prefix) + prefix.length);
  },

  async checkDocumentTitlePresentInTheDocumentsList(documentTitle: string) {
    this.useXpath();
    this.assert.visible(
      { selector: `//*[.='${documentTitle}']`, timeout: 10000 },
      "The document with title: " +
        documentTitle +
        " is present in the document list",
    );
    this.useCss();
  },

  async checkDocumentTitleIsNotPresentInTheDocumentsList(
    documentTitle: string,
  ) {
    this.useXpath();
    this.assert.not.elementPresent(
      `//*[.='${documentTitle}']`,
      "The document: " + documentTitle + " is not present in the document list",
    );
    this.useCss();
  },

  async setTenantId(tenantId: string) {
    return await this.setValue("@tenantIdInputField", tenantId);
  },

  async setClientId(clientId: string) {
    return await this.setValue("@clientIdInputField", clientId);
  },

  reloadComponentWithSpecifiedTenantIdAndClientId(
    tenantId: string,
    clientId: string,
  ) {
    this.setValue("@clientIdInputField", clientId);
    this.setValue("@tenantIdInputField", tenantId);
    this.click("@reloadButton");
  },
};

module.exports = {
  url: function () {
    return `${this.api.launch_url}/list-documents`;
  },
  commands: [listDocumentsCommands],
  sections: {
    deleteDocumentDialog: {
      selector: "#dpdocuments-list-delete-dialog",
      elements: {
        cancelButton: {
          selector: "#-dialog-text-cancel-button",
        },
        deleteButton: {
          selector: "-button[data-automation*='button-ok']",
        },
        dialogTitle: {
          selector: ".dialog-header",
        },
        dialogMessage: {
          selector: ".dialog-msg",
        },
      },
      commands: [],
    },
  },
  elements: {
    listComponent: {
      selector: "-dplist-component",
    },
    addDocumentButton: {
      selector: "#-dpadd-document",
    },
    addDocumentButtonVisibilityCheckbox: {
      selector: "#list-add-document-option",
    },
    reloadButton: {
      selector: "#list-reload-btn",
    },
    documentsList: {
      selector: "#-dplist-documents-list",
    },
    addedDocumentTitle: {
      selector: "//*[contains(text(), 'Added')]/../*[@class='-line-primary']",
      locateStrategy: "xpath",
    },
    aqaDocument: {
      selector: "//*[contains(text(), 'docAQA')]/../*[@class='-line-primary']",
      locateStrategy: "xpath",
      index: 0,
    },
    pdfDocumentTitle: {
      selector:
        "//-icon[contains(@aria-label, 'pdf')]/ancestor::-list-item//*[@class='-line-primary']",
      locateStrategy: "xpath",
    },
    overflowMenu: {
      selector: "-menu-container -select-item-group",
    },
    downloadDocumentOverflowMenuButton: {
      selector: "-select-item[id*='list-document-item-download-action']",
    },
    documentDetailsOverflowMenuButton: {
      selector: "-select-item[id*='list-document-item-detail-action']",
    },
    deleteDocumentOverflowMenuButton: {
      selector: "-select-item[id*='list-document-item-delete-action']",
    },
    tenantIdInputField: {
      selector: "-input[formcontrolname='tenantId'] input",
    },
    clientIdInputField: {
      selector: "-input[formcontrolname='clientId'] input",
    },
    noDocumentsMessage: {
      selector: "#-dplist-no-documents",
    },
    listDocumentComponent: {
      selector: "#-main-parent-container",
    },
    toastNotification: {
      selector: "body -snackbar",
    },
  },
};
