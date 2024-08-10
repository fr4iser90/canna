import { configURL } from "../../global.js";

export async function handleRegister(event) {
    event.preventDefault();
    const registerForm = event.target;
    const formData = new FormData(registerForm);
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
        const response = await fetch(`${configURL.API_BASE_URL}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();

        if (response.ok && data.token) {
            alert("Successfully registered!");
            localStorage.setItem("user", JSON.stringify({ username, role: data.role }));
            window.location.href = "/calendar";
        } else {
            console.error("Registration failed - Response status:", response.status);
            console.error("Registration failed - Response data:", data);
            alert(data.message || "Registration failed. Please try again.");
        }
    } catch (error) {
        console.error("Error during registration:", error);
        alert("An error occurred. Please try again later.");
    }
}
