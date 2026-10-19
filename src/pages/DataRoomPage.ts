import { type Page } from "@playwright/test";
import { CreateFolderDialog } from "../components/CreateFolderDialog.ts";
import { ShareDialog } from "../components/ShareDialog.ts";
import { BasePage } from "./BasePage.ts";

export class DataRoomPage extends BasePage {
  readonly createFolderDialog: CreateFolderDialog;
  readonly shareDialog: ShareDialog;

  constructor(page: Page) {
    super(page);
    this.createFolderDialog = new CreateFolderDialog(page);
    this.shareDialog = new ShareDialog(page);
  }

  get myDataRoomsTab() {
    return this.page.getByRole("link", { name: "My data rooms" });
  }

  get sharedWithMeTab() {
    return this.page.getByRole("link", { name: "Shared with me" });
  }

  get signOutButton() {
    return this.page.getByRole("button", { name: "Sign out" });
  }

  get newFolderButton() {
    return this.page.getByRole("button", { name: /new folder/i });
  }

  get uploadButton() {
    return this.page.getByRole("button", { name: /^upload$/i });
  }

  get shareRoomButton() {
    return this.page.getByRole("button", { name: "Share", exact: true });
  }

  get pdfInput() {
    return this.page.locator('input[type="file"][accept="application/pdf"]');
  }

  get uploadsComplete() {
    return this.page.getByText("Uploads complete");
  }

  rowByName(name: string) {
    return this.page.getByRole("row", { name: new RegExp(name) });
  }

  async openCreateFolderDialog() {
    await this.newFolderButton.click();
  }

  async createFolder(name: string) {
    await this.openCreateFolderDialog();
    await this.createFolderDialog.create(name);
  }

  async openShareDialog() {
    await this.shareRoomButton.click();
  }

  async uploadPdf(filePath: string) {
    await this.pdfInput.setInputFiles(filePath);
  }
}
