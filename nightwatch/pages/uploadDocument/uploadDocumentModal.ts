import {
  checkFileExists,
  generateDocumentTitleTimeStamp,
  getTestDocumentPathByType,
} from "../../commands/testDataUtil";

const uploadCommands = {
  emulateDocumentUpload() {
    return this.api.execute(function () {
      let uploadComponent = document.querySelector(
        "body > modal upload.hydrated",
      );
      // @ts-ignore
      uploadComponent.uploadFiles(
        [
          {
            name: "emulatedDocument.pdf",
            size: 3456789,
            type: "application/pdf",
          },
        ],
        true,
      );
    });
  },
  async uploadDocument(testDocumentPath: string) {
    const uploadComponent = await this.getShadowRoot("@uploadComponent");
    const dropZoneElement = await uploadComponent.find(
      this.elements.dropZoneElement.selector,
    );
    const dropZoneShadowRoot = await this.getShadowRoot(dropZoneElement);
    const inputFileElement = await dropZoneShadowRoot.find("input");
    return this.uploadFile(inputFileElement, testDocumentPath);
  },
};

const uploadModalCommands = {
  async getUploadedFileName() {
    const uploadComponent = await this.getShadowRoot("@uploadComponent");
    const uploadedFileElement = await uploadComponent.find(
      this.elements.uploadedFileElement.selector,
    );
    const uploadedFileInfo = await this.getShadowRoot(uploadedFileElement);
    return await uploadedFileInfo.find(this.elements.uploadedFileName.selector);
  },
  async closeModalWithoutSaving() {
    let leaveWithoutSavingDialog =
      browser.page.baseComponent().section.leaveWithoutSavingDialog;
    this.click("@closeButton");
    if (
      (await this.isPresent({
        selector: leaveWithoutSavingDialog.selector,
        suppressNotFoundErrors: true,
      })) &&
      (await this.isVisible(leaveWithoutSavingDialog))
    ) {
      leaveWithoutSavingDialog.click("@confirmButton");
    }
    this.waitForElementNotPresent("@uploadDocumentModal");
  },
  async getSaveButtonLabelText() {
    return this.getElementProperty("@saveButton", "innerText");
  },
  async addDocumentFileWithTimeStampTitle(documentExtension: string) {
    let editDocumentTitleElement =
      browser.page.baseComponent().section.documentTitleElement;
    let documentTitleTimeStamp = generateDocumentTitleTimeStamp();
    let testDocumentPath = getTestDocumentPathByType(documentExtension);
    checkFileExists(testDocumentPath);
    await this.uploadDocument(testDocumentPath);
    editDocumentTitleElement.setDocumentTitle(documentTitleTimeStamp);
    return documentTitleTimeStamp;
  },
  async addPdfFileWithTimeStampTitle() {
    return this.addDocumentFileWithTimeStampTitle("pdf");
  },
};

module.exports = {
  commands: [uploadCommands, uploadModalCommands],
  elements: {
    uploadDocumentModal: {
      selector: "body > modal div[aria-label='upload-document-modal']",
    },
    closeButton: {
      selector: "body > modal button[id*='nav-close-button']",
    },
    uploadModalHeader: {
      selector: "modal #dp-upload-nav-header",
    },
    uploadModalTitle: {
      selector: "modal h2",
    },
    uploadFileSizeLabel: {
      selector: "modal .file-size-label",
    },
    uploadComponent: {
      selector: "modal upload.hydrated",
    },
    dropZoneElement: {
      selector: "dropzone",
    },
    uploadedFileElement: {
      selector: "upload-file",
    },
    uploadedFileName: {
      selector: ".upload-file-filename",
    },
    uploadProgressBar: {
      selector: "progress-minimal[class*='upload-file-progress']",
    },
    saveButton: {
      selector: "modal #dp-upload-save-button",
    },
    deleteFileButton: {
      selector: "button[parent-icon='delete']",
    },
    toastNotification: {
      selector: "body snackbar",
    },
  },
};
