// LLamado a las secciones de busqueda la lupa para realizar evento de cambio de sección
searchFormBtn.addEventListener('click', () => {
    // Buscador de películas/ eventos de click del botom
    location.hash = '#search=' +  searchFormInput.value;
});
trendingBtn.addEventListener('click', () => {
    location.hash = '#trends';
});
arrowBtn.addEventListener('click', () => {
    history.back(); //Historial de navegación
    // location.hash = '#home';
});

window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);

function navigator() {
    console.log({ location });

    if (location.hash.startsWith('#trends')) {
        trendsPage()
    } else if (location.hash.startsWith('#search=')) {
        searchPage();
    } else if (location.hash.startsWith('#movie=')) {
        movieDetailsPage();
    } else if (location.hash.startsWith('#category=')) {
        categoriesPage();
    } else {
       homePage();
    }

    // scrollTop y DRY
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

function homePage() {
    console.log('Home!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.add('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.remove('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');


    getTCategegoriesPreview();
    getTrendingMoviesPreview();
    
}
function categoriesPage() {
    console.log('categories!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('header-arrow--white');
    arrowBtn.classList.remove('inactive');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    // agarrando el hash y convirtiendolo en arrays 
   const [_, categoryData] = location.hash.split('=');
   const [categoryId, categoryName] = categoryData.split('-');

   headerCategoryTitle.innerHTML = categoryName;

    getMoviesByCategory(categoryId);

}

function  movieDetailsPage() {
    console.log('Movie!!');
    
    headerSection.classList.add('header-container--long');
    // headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');

    
     //['#movie', '234525'] 
    // agarrando el hash y convirtiendolo en arrays 
   const [_, movieId] = location.hash.split('=');
   getMovieById(movieId);
}
function  searchPage() {
    console.log('Search!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('header-arrow--white');
    arrowBtn.classList.remove('inactive');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

     //['#search', 'buscador'] / Consulta a la api / busqueda en el form de la pelicula que quieras
    // agarrando el hash y convirtiendolo en arrays 
   const [_, query] = location.hash.split('=');
   getMoviesBySearch(query);
}
function trendsPage() {
    console.log('TRENDS!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('header-arrow--white');
    arrowBtn.classList.remove('inactive');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    headerCategoryTitle.innerHTML = 'Tendencias';
    // página de tendencias
    getTrendingMovies();
}