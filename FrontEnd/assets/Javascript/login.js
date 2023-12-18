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

            // Stocker uniquement le jeton d'authentification dans localStorage
            localStorage.setItem("authToken", authResponse.token);

            // Redirection vers la page d'accueil
            window.location.replace("index.html");
        } catch (error) {
            console.error(error);

            // En cas d'erreur, effacer le jeton d'authentification
            localStorage.removeItem("authToken");

            // Affichage du message d'erreur sur l'écran
            errorNotification.innerText = "Nom d'utilisateur ou mot de passe incorrect";
        }
    });
});

