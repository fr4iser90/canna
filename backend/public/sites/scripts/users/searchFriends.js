import { fetchWithAuth } from "../global.js";
import { displayFriendsSearchResults } from "./displayFriendsSearchResults.js";

export async function searchFriends(query) {
  try {
    const response = await fetchWithAuth('/api/friends/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    const results = await response.json();
    displayFriendsSearchResults(results);
  } catch (error) {
    console.error('Error searching for friends:', error);
  }
}
