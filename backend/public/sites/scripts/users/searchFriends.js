import { displayFriendsSearchResults } from "./displayFriendsSearchResults.js";

export async function searchFriends(query) {
  try {
    const response = await fetchWithCookies(
      `/api/friends/search`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',

        },
        body: JSON.stringify({ query })
      }
    );

    if (response.ok) {
      const results = await response.json();
      displayFriendsSearchResults(results);
    } else {
      const result = await response.json();
      console.error('Error searching for friends:', result.message);
    }
  } catch (error) {
    console.error('Error searching for friends:', error);
  }
}
