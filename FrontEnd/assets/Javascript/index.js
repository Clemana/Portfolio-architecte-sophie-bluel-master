document.addEventListener('DOMContentLoaded', () => {
  const gallery = document.querySelector('.gallery');
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
      integrerProjets(allWorks, gallery);
      displayCategories(categoriesData);
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    }
  }

  function integrerProjets(projets, gallery) {
    gallery.innerHTML = '';

    projets.forEach(projet => {
      const figure = document.createElement('figure');
      const img = document.createElement('img');
      const figcaption = document.createElement('figcaption');

      img.src = projet.imageUrl;
      img.alt = projet.title;

      figcaption.textContent = projet.title;

      figure.appendChild(img);
      figure.appendChild(figcaption);

      gallery.appendChild(figure);
    });
  }

  function displayCategories(categories) {
    const portfolioSection = document.getElementById('portfolio');

    // Créer un conteneur pour les boutons de filtre
    const filtersContainer = document.createElement('div');
    filtersContainer.id = 'filters-container';

    // Ajouter le bouton "Tous les travaux" au conteneur
    const allWorksButton = document.createElement('button');
    allWorksButton.textContent = 'Tous les travaux';
    allWorksButton.classList.add('filter-button');
    allWorksButton.addEventListener('click', () => {
      integrerProjets(allWorks, gallery);
    });

    filtersContainer.appendChild(allWorksButton);

    // Ajouter les boutons de filtre au conteneur
    categories.forEach(category => {
      const filterButton = document.createElement('button');
      filterButton.textContent = category.name;
      filterButton.classList.add('filter-button'); // Ajouter une classe pour le style
      filterButton.addEventListener('click', () => {
        filterWorksByCategory(category.id);
      });

      filtersContainer.appendChild(filterButton);
    });

    // Insérer le conteneur des boutons de filtre juste après le titre "Projets"
    portfolioSection.querySelector('h2').insertAdjacentElement('afterend', filtersContainer);
  }

  function filterWorksByCategory(categoryId) {
    const filteredWorks = allWorks.filter(work => work.categoryId === categoryId);
    integrerProjets(filteredWorks, gallery);
  }

  fetchData();
});