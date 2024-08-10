import { switchToLogin, switchToRegister, switchToForgotPassword } from "../utils/switchForms.js";

export function setupSwitchFormsListeners() {
    document.querySelector(".switch-to-register")
        .addEventListener("click", switchToRegister);

    document.querySelector(".switch-to-login")
        .addEventListener("click", switchToLogin);

    document.querySelector(".switch-to-forgot-password")
        .addEventListener("click", switchToForgotPassword);
}
