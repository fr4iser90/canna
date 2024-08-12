import { setupFormListeners, setupSwitchFormsListeners } from "../listeners/index.js";
import { switchToLogin } from "../utils/switchForms.js";


document.addEventListener("DOMContentLoaded", async () => {

    // Wenn kein gültiges Token vorhanden ist, zeige das Login-Formular
    setupFormListeners();
    setupSwitchFormsListeners();
    switchToLogin();
});