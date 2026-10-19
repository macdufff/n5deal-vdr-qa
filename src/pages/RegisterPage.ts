import { BasePage } from "./BasePage.ts";

export class RegisterPage extends BasePage {
  get nameInput() {
    return this.page.getByLabel("Full name");
  }

  get emailInput() {
    return this.page.getByLabel("Email");
  }

  get passwordInput() {
    return this.page.getByLabel("Password", { exact: true });
  }

  get confirmPasswordInput() {
    return this.page.getByLabel("Confirm password");
  }

  get createAccountButton() {
    return this.page.getByRole("button", { name: "Create account" });
  }

  async open() {
    await this.goto("/register");
  }

  async createAccount(input: { name: string; email: string; password: string }) {
    await this.nameInput.fill(input.name);
    await this.emailInput.fill(input.email);
    await this.passwordInput.fill(input.password);
    await this.confirmPasswordInput.fill(input.password);
    await this.createAccountButton.click();
  }
}
