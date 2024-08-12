import { initializeDatabaseManager } from "../init/databaseManagerInit.js";
import { initializeUserManager } from "../init/userManagerInit.js";
import { initializeChangePassword } from "../init/changePasswordInit.js";
import { initializeCommonFeatures } from "../../../common/initCommon.js";

document.addEventListener("DOMContentLoaded", async function () {

  await initializeCommonFeatures();
  initializeDatabaseManager();
  initializeUserManager();
  initializeChangePassword();
});
