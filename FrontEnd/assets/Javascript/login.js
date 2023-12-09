document.addEventListener("DOMContentLoaded", function () {
    
    const emailInput = document.querySelector("#username");
    const passwordInput = document.querySelector("#password");
    const formInfos = document.querySelector("#loginForm");

    formInfos.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = emailInput.value;
        const password = passwordInput.value;
        const userInfos = { email, password };

        try {
            const authentificationInfos = await fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userInfos),
            });

            if (!authentificationInfos.ok) {
                throw new Error("Erreur d'authentification");
            }

            const authentificationResponse = await authentificationInfos.json();

            sessionStorage.setItem("authentificationToken", authentificationResponse.token);
            sessionStorage.setItem("userId", authentificationResponse.userId);
            sessionStorage.setItem("authentificationState", true);

           
            window.location.replace("index.html");
        } catch (error) {
            console.error(error);
            sessionStorage.setItem("authentificationState", false);

            const wrongUserNotification = document.querySelector(".wrong-user-notification");
            wrongUserNotification.innerText = "Nom d'utilisateur ou mot de passe incorrect.";
        }
    });
});
