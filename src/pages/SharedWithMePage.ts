import { BasePage } from "./BasePage.ts";

export class SharedWithMePage extends BasePage {
  get heading() {
    return this.page.getByRole("heading", { name: "Shared with me" });
  }

  get emptyState() {
    return this.page.getByText("Nothing has been shared with you yet.");
  }

  itemByName(name: string) {
    return this.page.getByRole("link", { name: new RegExp(name) });
  }

  async open() {
    await this.goto("/shared-with-me");
  }
}
