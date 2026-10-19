import { type Page } from "@playwright/test";

export class CreateFolderDialog {
  constructor(private readonly page: Page) {}

  get nameInput() {
    return this.page.getByLabel("Folder name");
  }

  get submitButton() {
    return this.page.getByRole("button", { name: "Create" });
  }

  get cancelButton() {
    return this.page.getByRole("button", { name: "Cancel" });
  }

  async fillName(name: string) {
    await this.nameInput.fill(name);
  }

  async submit() {
    await this.submitButton.click();
  }

  async create(name: string) {
    await this.fillName(name);
    await this.submit();
  }
}
