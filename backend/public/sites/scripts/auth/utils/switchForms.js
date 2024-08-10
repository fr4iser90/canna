// scripts/auth/switchForms.js
export function switchToRegister() {
  document.getElementById("loginContent").style.display = "none";
  document.getElementById("registerContent").style.display = "block";
  document.getElementById("forgotPasswordContent").style.display = "none";
}

export function switchToLogin() {
  document.getElementById("loginContent").style.display = "block";
  document.getElementById("registerContent").style.display = "none";
  document.getElementById("forgotPasswordContent").style.display = "none";
}

export function switchToForgotPassword() {
  document.getElementById("loginContent").style.display = "none";
  document.getElementById("registerContent").style.display = "none";
  document.getElementById("forgotPasswordContent").style.display = "block";
}
