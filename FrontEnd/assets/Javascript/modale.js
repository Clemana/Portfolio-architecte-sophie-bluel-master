document.addEventListener('DOMContentLoaded', async function () {
    
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const closeModalTwoBtn = document.getElementById('closeModalTwoBtn');
    const modal = document.getElementById('myModal');
    const modalContent = document.querySelector('.modal-content');
    const modalTwo = document.querySelector('.modal-two');
    const modalGallery = document.querySelector('.modal-gallery');
    const addPhotoBtn = document.querySelector('.modal-content .modal-addPhoto');
    const returnModalOne = document.querySelector('.modal-two .return-modal-one');
    const addPhotoInput = document.getElementById('addPhoto');
    const formElement = document.getElementById('modal-two-form');
    

    try {
        // Récupération des catégories depuis l'API
        const response = await fetch("http://localhost:5678/api/categories");
        const dataCategories = await response.json();

        
        const select = document.getElementById("photoCategories");

        // Catégorie vide pour le visuel
        const emptyOption = document.createElement('option');
        select.appendChild(emptyOption);

        
        dataCategories.forEach((category) => {
            const option = document.createElement('option');
            option.innerText = category.name;
            option.value = category.id;
            select.appendChild(option);
        });

    } catch (error) {
        console.error('Error fetching categories:', error);
    }

  

 
    openModalBtn.addEventListener('click', async function () {
        try {
            
            const works = await fetchWorksFromApi();
            updateModalContent(works);
            showModal();
        } catch (error) {
            console.error('Error fetching works:', error);
        }
    });

    closeModalBtn.addEventListener('click', hideModal);
    closeModalTwoBtn.addEventListener('click', hideModal);
    window.addEventListener('click', closeOnOverlayClick);
    addPhotoBtn.addEventListener('click', switchToModalTwo);
    returnModalOne.addEventListener('click', showModalContent);
    addPhotoInput.addEventListener('change', handlePhotoChange);

    
    function updateModalContent(works) {
        modalGallery.innerHTML = '';

        works.forEach(work => {
            const workElement = createWorkElement(work, true);
            modalGallery.appendChild(workElement);
        });
    }

    function updateMainGallery(works) {
        const mainGallery = document.querySelector('.gallery');
    
        mainGallery.innerHTML = '';
    
        works.forEach(work => {
            const workElement = createWorkElement(work, false);
            mainGallery.appendChild(workElement);
        });
    }
    

    
    function createWorkElement(work, isInModal) {
        const workElement = document.createElement('div');
        workElement.classList.add('work-item');
        workElement.setAttribute('data-id', work.id);
    
        const thumbnailContainer = document.createElement('div');
        thumbnailContainer.classList.add('thumbnail-container');
    
        const thumbnail = document.createElement('img');
        thumbnail.classList.add('thumbnail');
        thumbnail.src = work.imageUrl;
        thumbnail.alt = work.title;
    
        thumbnailContainer.appendChild(thumbnail);
    
        
        if (isInModal) {
            const deleteButton = createDeleteButton(work.id);
            thumbnailContainer.appendChild(deleteButton);
        }
    
        workElement.appendChild(thumbnailContainer);
    
        
        if (!isInModal) {
            const caption = document.createElement('figcaption');
            caption.innerText = work.title;
            workElement.appendChild(caption);
        }
    
        return workElement;
    }
    
    function createDeleteButton(workId) {
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    
        deleteButton.addEventListener('click', async () => {
            if (confirm("Voulez-vous supprimer le projet ?")) {
                const monToken = localStorage.getItem("authToken");
                if (monToken) {
                    try {
                        
                        await deleteProject(workId, monToken);
    
                        
                        const updatedMainGalleryWorks = await fetchWorksFromApi();
                        updateMainGallery(updatedMainGalleryWorks);
    
                        
                        const updatedModalWorks = await fetchWorksFromApi();
                        updateModalContent(updatedModalWorks);
                    } catch (error) {
                        console.error('Erreur lors de la suppression du projet :', error);
                    }
                } else {
                    alert("Utilisateur non connecté. Veuillez vous connecter.");
                }
            }
        });
    
        return deleteButton;
    }
    
    async function fetchWorksFromApi() {
        const response = await fetch('http://localhost:5678/api/works', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        return response.json();
    }

    async function deleteProject(id, token) {
        try {
            const response = await fetch(`http://localhost:5678/api/works/${id}`, {
                method: 'DELETE',
                headers: {
                    'accept': '*/*',
                    'Authorization': `Bearer ${token}`,
                }
            });

    
            if (response.ok) {
                
                const deletedElement = document.querySelector(`.work-item[data-id="${id}"]`);
                if (deletedElement) {
                    deletedElement.remove();
                    
                } else {
                    console.warn(`Element with data-id=${id} not found in modal gallery.`);
                }
            } else {
                alert("Echec de la suppression du projet...");
            }
        } catch (error) {
            
        }
    }
    
    function showModal() {
        modalContent.style.display = 'block';
        modalTwo.style.display = 'none';
        modal.style.display = 'block';
        modal.classList.add('modal');
    }

    
    function hideModal() {
        modalContent.style.display = 'block';
        modalTwo.style.display = 'none';
        modal.style.display = 'none';
    }

    
    function closeOnOverlayClick(event) {
        if (event.target === modal) {
            showModalContent();
            hideModal();
        }
    }

    
    function switchToModalTwo() {
        hideModalContent();
        showSecondModal();
    }

    
    function hideModalContent() {
        modalContent.style.display = 'none';
        modalTwo.style.display = 'block';
    }

    
    function showModalContent() {
        modalContent.style.display = 'block';
        modalTwo.style.display = 'none';
    }

    
    function showSecondModal() {
        modalContent.style.display = 'none';
        modalTwo.style.display = 'block';
    }

    function handlePhotoChange() {
        const previewContainer = document.querySelector('.modal-two-imgcontainer');
        const previewImage = document.createElement('img');

        const file = addPhotoInput.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                previewImage.src = e.target.result;
                previewImage.alt = file.name;

              
                while (previewContainer.firstChild) {
                    previewContainer.removeChild(previewContainer.firstChild);
                }

                
                previewContainer.appendChild(previewImage);
            };

           
            reader.readAsDataURL(file);
        }
    }

    formElement.addEventListener('submit', validationFormModal);
    
    async function fetchDataAndUpdateDOM() {
        try {
            const updatedWorks = await fetchWorksFromApi();
            
    
            // Mise à jour du DOM avec les nouveaux projets
            updateMainGallery(updatedWorks);
        } catch (error) {
            console.error("Erreur lors de la mise à jour du DOM :", error);
        }
    }

    async function validationFormModal(event) {
        event.preventDefault()
        try {
            // Sélection des infos pour soumettre le formulaire
            const inputImageUrl = addPhotoInput.files[0];
            const titleProject = document.getElementById("photoTitle").value;
            const categoryProject = document.getElementById("photoCategories").value;

            if (!inputImageUrl || !titleProject || !categoryProject) {
                alert("Merci de remplir tous les champs");
                return;
            }
    
            // Création du formulaire de soumission du projet
            const formData = new FormData();
            formData.append("image", inputImageUrl);
            formData.append("title", titleProject);
            formData.append("category", categoryProject);
    
            const myToken = localStorage.getItem("authToken");
    
            if (!myToken) {
                console.error("Token d'authentification manquant. Veuillez vous connecter.");
                return;
            }
    
    
            const response = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${myToken}`,
                },
                body: formData,
            });
    
            if (response.ok) {
               
                const data = await response.json();
                const newWorkElement = createWorkElement(data);
                modalGallery.appendChild(newWorkElement);
                
                await fetchDataAndUpdateDOM();

                formElement.reset();

                addPhotoInput.value = '';
                
                hideModal();
                
            } else if (response.status === 400) {
                alert("Erreur : Données du formulaire incorrectes");
            } else if (response.status === 401) {
                alert("Erreur : Non autorisé. Veuillez vous connecter.");
                window.location.href = "login.html";
            } else if (response.status === 500) {
                alert("Erreur serveur");
            } else {
                alert(`Erreur inattendue. Code de statut : ${response.status}`);
            }
        } catch (error) {
            // Gérer les erreurs
            console.error("Erreur lors de l'ajout du projet :", error);
        }
        
    }

    const modalTwoValidateButton = document.getElementById('validateProject');

    formElement.addEventListener('input', validateModalTwoForm);
    addPhotoInput.addEventListener('change', validateModalTwoForm);
    
    function validateModalTwoForm() {
        const inputImageUrl = addPhotoInput.files[0];
        const titleProject = document.getElementById("photoTitle").value;
        const categoryProject = document.getElementById("photoCategories").value;
    
        // Variable pour stocker le message d'erreur
        let errorMessage = "";
    
        // Vérifier si tous les champs sont remplis
        const isFormValid = formElement.checkValidity() && !!inputImageUrl && !!titleProject && !!categoryProject;
    
        // Mise à jour du message d'erreur
        if (!isFormValid) {
            errorMessage = "Merci de remplir tous les champs";
        }
    
        // Affichage du message d'erreur
        const errorMessageElement = document.getElementById("error-message");
        errorMessageElement.innerHTML = errorMessage;
    
        // Mise à jour du style du bouton en fonction de la validité du formulaire
        modalTwoValidateButton.style.backgroundColor = isFormValid ? '#1D6154' : '#A7A7A7';
        modalTwoValidateButton.disabled = !isFormValid;
        modalTwoValidateButton.style.cursor = isFormValid ? 'pointer' : 'not-allowed';
    }
    
    validateModalTwoForm();
    
});



