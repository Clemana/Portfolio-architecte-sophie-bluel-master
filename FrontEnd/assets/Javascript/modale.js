document.addEventListener('DOMContentLoaded', async function () {
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modal = document.getElementById('myModal');
    const modalContent = document.querySelector('.modal-content');
    const modalTwo = document.querySelector('.modal-two');
    const modalGallery = document.querySelector('.modal-gallery');
    const addPhotoBtn = document.querySelector('.modal-content button');

    openModalBtn.addEventListener('click', async function () {
        try {
            const response = await fetch('http://localhost:5678/api/works', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            const works = await response.json();

            updateModalContent(works);

            modalContent.style.display = 'block';
            modalTwo.style.display = 'none';
            modal.style.display = 'block';
        } catch (error) {
            console.error('Error fetching works:', error);
        }
    });

    closeModalBtn.addEventListener('click', function () {
        modalContent.style.display = 'block';
        modalTwo.style.display = 'none';
        modal.style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modalContent.style.display = 'block';
            modalTwo.style.display = 'none';
            modal.style.display = 'none';
        }
    });

    addPhotoBtn.addEventListener('click', function () {
        modalContent.style.display = 'none';
        modalTwo.style.display = 'block';
    });

    function updateModalContent(works) {
        modalGallery.innerHTML = '';

        works.forEach(work => {
            const workElement = document.createElement('div');
            workElement.innerHTML = `
                <img class="thumbnail" src="${work.imageUrl}" alt="${work.title}">
            `;

            modalGallery.appendChild(workElement);
        });
    }
});



