document.addEventListener('DOMContentLoaded', async function () {
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modal = document.getElementById('myModal');
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
            
            modal.style.display = 'block';
        } catch (error) {
            console.error('Error fetching works:', error);
        }
    });

    closeModalBtn.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    addPhotoBtn.addEventListener('click', function () {
        
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


