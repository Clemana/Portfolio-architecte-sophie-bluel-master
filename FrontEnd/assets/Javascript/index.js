document.addEventListener('DOMContentLoaded', () => {
    const galleryContainer = document.getElementById('gallery-container');
    let allWorks = [];
  
    async function fetchData() {
      try {
        const [worksResponse, categoriesResponse] = await Promise.all([
          fetch('http://localhost:5678/api/works'),
          fetch('http://localhost:5678/api/categories')
        ]);
  
        if (!worksResponse.ok || !categoriesResponse.ok) {
          throw new Error('Erreur HTTP dans au moins l\'une des requêtes');
        }
  
        const [worksData, categoriesData] = await Promise.all([
          worksResponse.json(),
          categoriesResponse.json()
        ]);
  
        allWorks = worksData;
        integrerProjets(allWorks, galleryContainer);
        displayCategories(categoriesData);
  
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    }
  
    function integrerProjets(projets, gallery) {
      gallery.innerHTML = '';
  
      projets.forEach(projet => {
        const projectContainer = document.createElement('div');
  
        const img = document.createElement('img');
        img.src = projet.imageUrl;
        img.alt = projet.title;
  
        const title = document.createElement('p');
        title.textContent = projet.title;
  
        projectContainer.appendChild(img);
        projectContainer.appendChild(title);
  
        gallery.appendChild(projectContainer);
      });
    }
  

  function displayCategories(categories) {
      const portfolioSection = document.getElementById('portfolio');

      const filtersContainer = document.createElement('div');
      filtersContainer.id = 'filters-container';

      const allWorksButton = document.createElement('button');
      allWorksButton.textContent = 'Tous les travaux';
      allWorksButton.classList.add('filter-button');
      allWorksButton.addEventListener('click', () => {
          integrerProjets(allWorks, gallery);
      });

      filtersContainer.appendChild(allWorksButton);

      categories.forEach(category => {
          const filterButton = document.createElement('button');
          filterButton.textContent = category.name;
          filterButton.classList.add('filter-button');
          filterButton.addEventListener('click', () => {
              filterWorksByCategory(category.id);
          });

          filtersContainer.appendChild(filterButton);
      });
      

      portfolioSection.querySelector('h2').insertAdjacentElement('afterend', filtersContainer);

      checkUserConnected();
  }
  
  function filterWorksByCategory(categoryId) {
      const filteredWorks = allWorks.filter(work => work.categoryId === categoryId);
      integrerProjets(filteredWorks, gallery);
  }

  fetchData();
  
});
