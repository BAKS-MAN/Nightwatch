const sideMenuCommands = {
  async changeLanguage() {
    if (!(await this.isVisible("@languageSelector"))) {
      this.click("@navigationMenuButton");
    }
    this.assert.visible("@languageSelector");
    // .setValue() is not working in Safari, only this solution works:
    this.api.execute(function () {
      let select = document.querySelector("#dp-language-select"),
        option = select.querySelector("option[value='fr-FR']");
      // @ts-ignore
      select.value = option.value;
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });
    this.pause(1500); // Otherwise click on navigation menu is not working.
    this.click("@navigationMenuCloseButton");
    this.waitForElementNotVisible("@languageSelector");
  },
};

module.exports = {
  url: function () {
    return `${this.api.launch_url}`;
  },
  commands: [sideMenuCommands],
  elements: {
    navigationMenuButton: {
      selector: "#nav-menu-button",
    },
    navigationMenuCloseButton: {
      selector: "button[class*='nav-close-button']",
    },
    languageSelector: {
      selector: "#dp-language-select",
    },
  },
};
