const chromeDownloadsPageCommands = {
  async getDownloadedFileName() {
    let downloadManagerShadowRoot =
      await this.getShadowRoot("@downloadsManager");
    let downloadsList = await downloadManagerShadowRoot.find("downloads-item");
    let downloadsListShadowRoot = await this.getShadowRoot(downloadsList);
    let downloadedFileInfo = await downloadsListShadowRoot.find("a");
    return this.getElementProperty(downloadedFileInfo, "innerText");
  },
  async checkDownloadListIsNotEmpty() {
    let downloadManagerShadowRoot =
      await this.getShadowRoot("@downloadsManager");
    let noDownloadsInfo = await downloadManagerShadowRoot.find("#no-downloads");
    this.assert.not.visible(
      noDownloadsInfo,
      "Check list of downloaded files is not empty",
    );
  },
};

module.exports = {
  url: function () {
    return "chrome://downloads/";
  },
  commands: [chromeDownloadsPageCommands],
  elements: {
    downloadsManager: {
      selector: "downloads-manager",
    },
  },
};
