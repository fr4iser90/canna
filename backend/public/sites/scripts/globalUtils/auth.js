import { configURL } from './config.js';
import { getCookies, deleteToken } from './cookies.js';
import { enqueueRequest } from './requestQueue.js';

export async function fetchWithAuthInternal(url, options = {}) {
  const cookies = getCookies();
  const authData = cookies.authData ? JSON.parse(decodeURIComponent(cookies.authData)) : null;
  const token = authData ? authData.token : null;

  if (!token) {
    throw new Error("No valid token available");
  }

  const defaultHeaders = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  options.headers = {
    ...defaultHeaders,
    ...options.headers,
  };

  options.credentials = "include"; // Ensure cookies are included in requests

  const response = await fetch(url, options);
  if (response.status === 401) {
    console.error("Unauthorized request, redirecting to login");
    window.location.href = '/login';
  }
  return response;
}

export async function fetchWithAuth(url, options = {}) {
  return enqueueRequest(url, options);
}

export async function checkTokenAndRedirect() {
  const token = getToken();
  if (!token) {
    window.location.href = '/login';
    return;
  }

  try {
    const response = await fetch(`${configURL.API_BASE_URL}/api/auth/verifyToken`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await response.json();

    if (!data.valid) {
      deleteToken();
      window.location.href = '/login';
    } else {
      const logoutLink = document.getElementById("logoutLink");
      const adminPanelLink = document.getElementById("adminPanelLink");
      if (logoutLink) {
        logoutLink.style.display = "block";
      }
      if (data.role === "admin" && adminPanelLink) {
        adminPanelLink.style.display = "block";
      }
      document.body.classList.remove("loading"); // Hide the loading indicator
      document.body.classList.add("loaded"); // Make the page visible
    }
  } catch (error) {
    console.error("Error during token verification:", error);
    deleteToken();
    window.location.href = '/login';
  }
}

export async function checkUserRole() {
  try {
    const userRoleResponse = await fetchWithAuth("/api/userRole/get", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (userRoleResponse.ok) {
      const data = await userRoleResponse.json();
      const adminLink = document.getElementById("adminLink");
      if (data.roles && data.roles.includes("admin")) {
        adminLink.classList.remove("hidden");
        adminLink.style.display = "block"; // Ensure it's displayed
      }
    } else {
      console.error("Failed to fetch user role");
    }
  } catch (error) {
    console.error("Error fetching user role:", error);
  }
}
