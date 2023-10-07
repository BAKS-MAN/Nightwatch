const uploadDocumentCommands = {
  openUploadComponentPage() {
    this.navigate().waitForElementVisible("@uploadDocumentButton", 10000);
    this.assert.visible("@uploadDocumentButton");
  },
  setTenantId(tenantId: string) {
    return this.setValue("@tenantIdInput", tenantId);
  },
  setClientId(tenantId: string) {
    return this.setValue("@clientIdInput", tenantId);
  },
  setCategoryId(tenantId: string) {
    return this.setValue("@categoryIdInput", tenantId);
  },
  async setTestTenantIdClientIdCategoryId() {
    let clientId = browser.globals.clientId;
    let tenantId = browser.globals.tenantId;
    let categoryId = "123";
    await this.setTenantId(tenantId);
    await this.setClientId(clientId);
    await this.setCategoryId(categoryId);
  },
  async openUploadModal() {
    this.waitForElementVisible("@uploadDocumentButton");
    this.pause(500); // workaround: quick click on button sometimes doesn't work
    this.click("@uploadDocumentButton");
  },
};

module.exports = {
  commands: [uploadDocumentCommands],
  url: function () {
    return `${this.api.launch_url}/upload-document`;
  },

  elements: {
    uploadDocumentButton: {
      selector: "dp-document-upload-page button",
    },
    tenantIdInput: {
      selector: "input[formcontrolname='tenantId'] input",
    },
    clientIdInput: {
      selector: "input[formcontrolname='clientId'] input",
    },
    categoryIdInput: {
      selector: "input[formcontrolname='categoryId'] input",
    },
  },
};
