document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.querySelector("#username");
    const passwordInput = document.querySelector("#password");
    const formInfos = document.querySelector("#loginForm");
    const errorNotification = document.querySelector(".error-notification");

    formInfos.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = emailInput.value;
        const password = passwordInput.value;
        const userInfos = { email, password };

        try {
            const response = await fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userInfos),
            });

            if (!response.ok) {
                throw new Error("Erreur d'authentification");
            }

            const authResponse = await response.json();

            localStorage.setItem("authToken", authResponse.token);
 
            window.location.replace("index.html");
        } catch (error) {
            console.error(error);
            
            localStorage.removeItem("authToken");

            errorNotification.innerText = "Nom d'utilisateur ou mot de passe incorrect";
        }
    });
});

