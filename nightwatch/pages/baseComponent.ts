const baseComponentCommands = {};
const errorDialogCommands = {
  closeErrorDialog() {
    this.click("@okButton");
    this.assert.not.elementPresent("@dialogTitle");
  },
  async checkAuthenticationErrorDialogIsCorrect() {
    this.expect.element("@dialogTitle").text.to.equal("Unable to authenticate");
    this.expect
      .element("@dialogMessage")
      .property("innerText")
      .equals(
        "Something went wrong and we weren’t able to authenticate you. These things happen, please try again.",
      );
    this.expect.element("@errorCode").text.to.contain("authenticated");
  },
  async checkSomethingWentWrongErrorDialogIsCorrect() {
    this.expect.element("@dialogTitle").text.to.equal("Something went wrong");
    this.expect
      .element("@dialogMessage")
      .property("innerText")
      .equals(
        "You can try again, or if the problem continues reach out to your admin",
      );
    this.expect.element("@errorCode").text.to.match(/^$|\s+/);
  },
  async checkDocumentDoesntExistErrorDialogIsCorrect() {
    this.expect.element("@dialogTitle").text.to.equal("Document doesn’t exist");
    this.expect
      .element("@dialogMessage")
      .property("innerText")
      .equals(
        "We couldn’t find this document. It looks like it may have just been deleted. You may need to refresh your view.",
      );
    this.expect.element("@errorCode").text.to.contain("deleted-document");
  },
};
const documentTitleElementCommands = {
  setDocumentTitle(documentTitleValue: string) {
    return this.setAttribute(
      "@documentTitleInputField",
      "value",
      documentTitleValue,
    );
  },
  setEmptyDocumentTitle() {
    this.setDocumentTitle("Test");
    this.setDocumentTitle("");
  },
  async getDocumentTitleInputErrorText() {
    let documentTitleInputErrorText: string = await this.getElementProperty(
      "@documentTitleInputError",
      "innerText",
    );
    return documentTitleInputErrorText.split("\n")[0];
  },
};
const leaveWithoutSavingDialogCommands = {
  async getConfirmButtonLabelText() {
    return this.element("@confirmButton").getProperty("innerText");
  },
  async getCancelButtonLabelText() {
    return this.element("@cancelButton").getProperty("innerText");
  },
};

module.exports = {
  commands: [baseComponentCommands, documentTitleElementCommands],
  sections: {
    backendErrorDialog: {
      selector: "body > #dp-documents-backend-dialog",
      elements: {
        okButton: {
          selector: "button[data-automation*='button-ok']",
        },
        dialogTitle: {
          selector: ".dialog-header",
        },
        dialogMessage: {
          selector: ".dialog-msg",
        },
        errorCode: {
          selector: ".dp-documents-shared-error-code",
        },
      },
      commands: [errorDialogCommands],
    },
    documentTitleElement: {
      selector:
        "modal[class*='show-modal'] input-container[class*='document-title-container']",
      elements: {
        documentTitleInputField: {
          selector: "input",
        },
        documentTitleInputFieldLabel: {
          selector: "label",
        },
        documentTitleInputError: {
          selector: "[class*='assistive-message-error']",
        },
      },
      commands: [documentTitleElementCommands],
    },
    leaveWithoutSavingDialog: {
      selector: "dialog[style*='flex']",
      elements: {
        dialogTitle: {
          selector: ".dialog-header",
        },
        dialogMessage: {
          selector: ".dialog-msg",
        },
        confirmButton: {
          selector: "button[data-automation='dialog-button-ok']",
        },
        cancelButton: {
          selector: "#dialog-text-cancel-button",
        },
      },
      commands: [leaveWithoutSavingDialogCommands],
    },
  },
  elements: {},
};
