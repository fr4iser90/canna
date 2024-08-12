export async function handleLogin(event) {
    event.preventDefault();
    console.log("Login function called");
    const loginForm = event.target;
    const submitButton = loginForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;  // Verhindert erneutes Absenden

    const formData = new FormData(loginForm);
    const username = formData.get("username");
    const password = formData.get("password");

    try {
        const response = await fetch(`/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            alert("Successfully logged in!");
            localStorage.setItem(
                "user",
                JSON.stringify({ username: username, role: data.role }),
            );
            window.location.href = "/calendar";
        } else {
            console.error("Login failed - Response status:", response.status);
            console.error("Login failed - Response data:", data);
            alert(data.message || "Invalid login credentials. Please try again.");
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred. Please try again later.");
    } finally {
        submitButton.disabled = false;  // Reaktiviert den Button, falls notwendig
    }
}
