import { fetchWithAuth } from "../global.js";
import { displayBlockedUsers } from "./displayBlockedUsers.js";

export async function loadBlockedUsers() {
  try {
    const response = await fetchWithAuth('/api/friends/blocked');
    const blockedUsers = await response.json();
    displayBlockedUsers(blockedUsers);
  } catch (error) {
    console.error('Error loading blocked users:', error);
  }
}
