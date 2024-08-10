import { checkTokenAndRedirect } from "../global.js";
import { initializeDatabaseManager } from "../admin/databaseManager.js";
import { initializeUserManager } from "../admin/userManager.js";
import { initializeChangePassword } from "../auth/changePassword.js";
import { initializeCommonFeatures } from "../common/initCommon.js";
import { logout } from "../auth/logout.js";

document.addEventListener("DOMContentLoaded", async function () {
  // Überprüfe den Token und leite um, falls er ungültig ist
  await checkTokenAndRedirect();
  
  // Initialisiere allgemeine Funktionen
  await initializeCommonFeatures();
  
  // Initialisiere den Datenbankmanager
  initializeDatabaseManager();
  
  // Initialisiere das Benutzermanagement
  initializeUserManager();
  
  // Initialisiere die Passwortänderungsfunktion
  initializeChangePassword();
  
  // Füge das Logout-Event hinzu
  const logoutLink = document.getElementById("logoutLink");
  if (logoutLink) {
    logoutLink.addEventListener("click", logout);
  }
});
