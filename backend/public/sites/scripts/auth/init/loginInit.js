import { setupFormListeners, setupSwitchFormsListeners } from "../listeners/index.js";
import { switchToLogin } from "../utils/switchForms.js";
import { getToken, fetchWithAuth } from "../../global.js";

document.addEventListener("DOMContentLoaded", async () => {
    const token = getToken();
    if (token) {
        try {
            const response = await fetchWithAuth('/auth/verifyToken');
            if (response.ok) {
                window.location.href = "/calendar";
                return;
            }
        } catch (error) {
            console.error("Error verifying token:", error);
        }
    }

    setupFormListeners();
    setupSwitchFormsListeners();
    switchToLogin();
});
