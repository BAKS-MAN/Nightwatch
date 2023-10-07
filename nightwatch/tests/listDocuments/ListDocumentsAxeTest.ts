import "nightwatch-saucelabs-endsauce";

describe("Accessibility test for list document component", function () {
  this.tags = ["accessibility"];
  let listDocumentsPage;

  before(function () {
    listDocumentsPage = browser.page.listComponent.listDocumentsPage();
  });

  after(async function () {});

  test("list document component accessibility test", async function () {
    if (!browser.isChrome()) {
      return;
    }
    listDocumentsPage.openListComponentPage();
    await listDocumentsPage
      .axeInject()
      .axeRun(listDocumentsPage.elements.listDocumentComponent.selector, {
        rules: {
          // Temporary disabled due an issue: https://jira/browse/TST-470838
          "duplicate-id": {
            enabled: false,
          },
        },
      });
  });
});
