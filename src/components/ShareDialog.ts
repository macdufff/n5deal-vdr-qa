import { type Page } from "@playwright/test";

export class ShareDialog {
  constructor(private readonly page: Page) {}

  get createPublicLinkButton() {
    return this.page.getByRole("button", { name: "Create public link" });
  }

  get publicLinkField() {
    return this.page.locator('input[readonly]');
  }

  get emailInput() {
    return this.page.getByLabel("Email");
  }

  get grantAccessButton() {
    return this.page.getByRole("dialog").getByRole("button", { name: "Share", exact: true });
  }

  get doneButton() {
    return this.page.getByRole("button", { name: "Done" });
  }

  get sharedToast() {
    return this.page.getByText(/Shared with /);
  }

  async createPublicLink() {
    await this.createPublicLinkButton.click();
    await this.publicLinkField.waitFor();
  }

  async publicLinkUrl() {
    return this.publicLinkField.inputValue();
  }

  async shareWithEmail(email: string) {
    await this.emailInput.fill(email);
    await this.grantAccessButton.click();
  }
}
