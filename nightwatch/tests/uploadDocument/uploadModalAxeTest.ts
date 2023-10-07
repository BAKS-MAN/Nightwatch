import "nightwatch-saucelabs-endsauce";

describe("Accessibility tests for Upload document component", function () {
  this.tags = ["accessibility"];

  before(async function () {
    let uploadDocumentPage = browser.page.uploadDocument.uploadDocumentPage();
    uploadDocumentPage.openUploadComponentPage();
    await uploadDocumentPage.openUploadModal();
  });

  after(async function () {});

  test("Upload modal accessibility test", async function () {
    if (!browser.isChrome()) {
      return;
    }
    let uploadDocumentModal = browser.page.uploadDocument.uploadDocumentModal();
    await uploadDocumentModal
      .emulateDocumentUpload()
      /* ".pause()" is the workaround, otherwise the test is failed with 'color-contrast' issues
  from the configuration form as if the modal is not displayed,
  but all modal elements are visible, and waiting for element functions has no effect. */
      .pause(500)
      .axeInject()
      .axeRun(uploadDocumentModal.elements.uploadDocumentModal.selector, {
        rules: {
          // This is unsupported 'best-practice' level rule;
          "landmark-no-duplicate-banner": {
            enabled: false,
          },
        },
      });
  });
});
