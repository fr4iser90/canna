import { configURL } from "../global.js";

export async function logout() {
  try {
    await fetch(`${configURL.API_BASE_URL}/api/auth/logout`, { method: 'POST' });
    localStorage.removeItem("user");
    window.location.href = "/login";
} catch (error) {
    console.error("Error during logout:", error);
    alert("An error occurred while logging out. Please try again.");
}
}

document.addEventListener("DOMContentLoaded", () => {
  const logoutLink = document.getElementById("logoutLink");
  if (logoutLink) {
    logoutLink.addEventListener("click", logout);
  }
});
