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
            const workElement = createWorkElement(work);
            modalGallery.appendChild(workElement);
        });
    }

    
    function createWorkElement(work) {
        const workElement = document.createElement('div');
        workElement.classList.add('work-item');
        workElement.setAttribute('data-id', work.id);

        const thumbnailContainer = document.createElement('div');
        thumbnailContainer.classList.add('thumbnail-container');

        const thumbnail = document.createElement('img');
        thumbnail.classList.add('thumbnail');
        thumbnail.src = work.imageUrl;
        thumbnail.alt = work.title;

        const deleteButton = createDeleteButton(work.id);

        thumbnailContainer.appendChild(thumbnail);
        thumbnailContainer.appendChild(deleteButton);

        workElement.appendChild(thumbnailContainer);

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
                    await deleteProject(workId, monToken);
                    const updatedWorks = await fetchWorksFromApi();
                    updateModalContent(updatedWorks);
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
                    console.warn(`Element with data-id=${id} not found in DOM.`);
                }
            } else {
                alert("Echec de la suppression du projet...");
            }
        } catch (error) {
            console.log("Une erreur est survenue", error);
        }
    }
    

    
    function showModal() {
        modalContent.style.display = 'block';
        modalTwo.style.display = 'none';
        modal.style.display = 'block';
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
    

    async function validationFormModal(event) {
        event.preventDefault()
        try {
            // Sélection des infos pour soumettre le formulaire
            const inputImageUrl = addPhotoInput.files[0];
            const titleProject = document.getElementById("photoTitle").value;
            const categoryProject = document.getElementById("photoCategories").value;

           
    
            // Création du formulaire de soumission du projet
            const formData = new FormData();
            formData.append("image", inputImageUrl);
            formData.append("title", titleProject);
            formData.append("category", categoryProject);
    
            
            console.log("Données du formulaire :", {
                image: inputImageUrl,
                title: titleProject,
                category: categoryProject,
            });
    
            const myToken = localStorage.getItem("authToken");
    
            if (!myToken) {
                console.error("Token d'authentification manquant. Veuillez vous connecter.");
                return;
            }
    
            
            console.log("Token d'authentification :", myToken);
    
            const response = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${myToken}`,
                },
                body: formData,
            });
    
            if (!response.ok) {
                throw new Error(`Erreur lors de l'ajout du projet. Statut : ${response.status}`);
            }
    
            // Conversion de la réponse en JSON
            const data = await response.json();
    
            
            console.log("Projet ajouté avec succès :", data);
    
            
            modalGallery.innerHTML = '';
    
            
            const updatedWorks = await fetchWorksFromApi();
            console.log("Travaux mis à jour :", updatedWorks);
    
            updateModalContent(updatedWorks);
            hideModal();
        } catch (error) {
            // Gérer les erreurs
            console.error("Erreur lors de l'ajout du projet :", error);
        }
    }
    
    
 
    
});



