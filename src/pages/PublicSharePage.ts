import { WEB_URL } from "../config.ts";
import { BasePage } from "./BasePage.ts";

export class PublicSharePage extends BasePage {
  get revokedTitle() {
    return this.page.getByText("This link has been revoked", { exact: true });
  }

  sharedName(name: string) {
    return this.page.getByText(name, { exact: false });
  }

  async open(token: string) {
    await this.goto(`${WEB_URL}/share/${token}`);
  }
}
