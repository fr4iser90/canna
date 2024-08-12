import { configURL } from "../global.js";
import { displayBlockedUsers } from "./displayBlockedUsers.js";

export async function loadBlockedUsers() {
  try {
    const response = await fetch(
      `${configURL.API_BASE_URL}/api/friends/blocked`,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (response.ok) {
      const blockedUsers = await response.json();
      displayBlockedUsers(blockedUsers);
    } else {
      const result = await response.json();
      console.error('Error loading blocked users:', result.message);
    }
  } catch (error) {
    console.error('Error loading blocked users:', error);
  }
}
