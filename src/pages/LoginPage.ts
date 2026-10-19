import { BasePage } from "./BasePage.ts";

export class LoginPage extends BasePage {
  get heading() {
    return this.page.getByRole("heading", { name: "Sign in" });
  }

  get emailInput() {
    return this.page.getByLabel("Email");
  }

  get passwordInput() {
    return this.page.getByLabel("Password");
  }

  get signInButton() {
    return this.page.getByRole("button", { name: "Sign in" });
  }

  get invalidCredentialsMessage() {
    return this.page.getByText("Invalid email or password");
  }

  async open() {
    await this.goto("/login");
  }

  async signIn(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }
}
