
async function checkUserConnected() {
    console.log('checkUserConnected');
    const authToken = localStorage.getItem('authToken');
    const userConnected = authToken !== null && authToken !== undefined && authToken !== '';

    const loginLink = document.querySelector(".login-link");
    const navEdition = document.getElementById('navEdition');
    const buttonModify = document.getElementById("openModalBtn");
    const filtersSection = document.getElementById("filters-container");
    console.log(filtersSection)
    
    if (userConnected) {
        loginLink.textContent = "logout";
        loginLink.addEventListener("click", userLogOut);

        if (navEdition) {
            navEdition.style.visibility = 'visible';
        }

        if (filtersSection) {
            filtersSection.style.visibility = 'hidden';
        }

        if (buttonModify) {
            buttonModify.style.visibility = 'visible';
        } else {
            
            const gallery = document.querySelector('.gallery');
            const openModalBtn = document.createElement('button');
            openModalBtn.id = 'openModalBtn';
            openModalBtn.textContent = 'Modifier';
            gallery.insertAdjacentElement('afterend', openModalBtn);
        }
    } else {
        
        loginLink.textContent = "login";

        if (navEdition) {
            navEdition.style.visibility = 'hidden';
        }

        if (filtersSection) {
            filtersSection.style.visibility = 'visible';
        }

        if (buttonModify) {
            buttonModify.style.visibility = 'hidden';
        }
    }
}

// Fonction de déconnexion
function userLogOut() {
    // Nettoyage du localStorage => suppression du token
    localStorage.clear();
    // Rechargement de la page
    window.location.reload();
}

document.addEventListener('DOMContentLoaded', checkUserConnected);

