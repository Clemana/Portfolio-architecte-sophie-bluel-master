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
    const photoCategoriesSelect = document.getElementById('photoCategories');

    // Récupération des catégories depuis l'API
    fetch("http://localhost:5678/api/categories")
        .then(response => response.json())
        .then(dataCategories => {
            // On récupère le select pour ajouter les catégories
            const select = document.getElementById("photoCategories");

            // Catégorie vide pour le visuel
            const emptyOption = document.createElement('option');
            select.appendChild(emptyOption);

            // Récupération dynamique des catégories présentes sur API
            dataCategories.forEach((category) => {
                const option = document.createElement('option');
                option.innerText = category.name;
                option.value = category.id;
                select.appendChild(option);
            });
        });

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
                await deleteProject(workId);
                const updatedWorks = await fetchWorksFromApi();
                updateModalContent(updatedWorks);
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

    async function deleteProject(id) {
        const monToken = localStorage.getItem("token");

        try {
            const response = await fetch(`http://localhost:5678/api/works/${id}`, {
                method: 'DELETE',
                headers: {
                    'accept': '*/*',
                    'Authorization': `Bearer ${monToken}`,
                }
            });

            if (!response.ok) {
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

                // Efface le contenu existant avant d'ajouter la nouvelle image
                while (previewContainer.firstChild) {
                    previewContainer.removeChild(previewContainer.firstChild);
                }

                // Ajoute la nouvelle image à la modal
                previewContainer.appendChild(previewImage);
            };

            // Lit le fichier en tant que Data URL
            reader.readAsDataURL(file);
        }
    }
});


