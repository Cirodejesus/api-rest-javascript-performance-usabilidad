const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
    },
});

// Utils
function createMovies(movies, container) {
  container.innerHTML = '';

  movies.forEach(movie => {
   const movieContainer = document.createElement('div');
   movieContainer.classList.add('movie-container');
   movieContainer.addEventListener('click', () => {
    location.hash = '#movie=' + movie.id;
   });
    const movieImg = document.createElement('img');
    movieImg.classList.add('movie-img');
    movieImg.setAttribute('alt', movie.title);
    movieImg.setAttribute(
       'src', 
       'https://image.tmdb.org/t/p/w300' + movie.poster_path);
       
       movieContainer.appendChild(movieImg);
      container.appendChild(movieContainer);
   });
}

function createCategories(categories, container) {

  container.innerHTML = '';
  // console.log({ data, movies });
  categories.forEach(category => {

    const categoryContainer = document.createElement('div');
    categoryContainer.classList.add('category-container');

    const categoryTitle = document.createElement('h3');
    categoryTitle.classList.add('category-title');
    categoryTitle.setAttribute('id', 'id' + category.id);
   // Evento para atrapar categorias y nos lleve cuando le hagamos click a cada   una de ellas.
   categoryTitle.addEventListener('click', () => {
     location.hash  = `#category=${category.id}-${category.name}`;
   });

    const categoryTitleText = document.createTextNode(category.name);
    categoryTitle.appendChild(categoryTitleText);
    categoryContainer.appendChild(categoryTitle);
    container.appendChild(categoryContainer);
     
   });
}


// Llamados a la API
async function getTrendingMoviesPreview() {
    const { data } = await api('trending/movie/day');
  //    iteración x cada elemento
    const movies = data.results;
     console.log(movies);

   createMovies(movies, trendingMoviesPreviewList)

}

async function getTCategegoriesPreview() {
    const { data } = await api('genre/movie/list');
    const categories = data.genres;
    
    // Para no duplicar imagenes el en DOM
    createCategories(categories, categoriesPreviewList)
}
    
async function getMoviesByCategory(id) {
    const { data } = await api('discover/movie', {
      params: {
        with_genres: id,
      }  
    });
  //    iteración x cada elemento
    const movies = data.results;
   createMovies(movies, genericSection);
}
// Consulta a la api / busqueda en el form de la pelicula que quieras
async function getMoviesBySearch(query) {
    const { data } = await api('search/movie', {
      params: {
        query,
      }  
    });
  //    iteración x cada elemento
    const movies = data.results;
   createMovies(movies, genericSection);
}
// página de tendencias
async function getTrendingMovies() {
  const { data } = await api('trending/movie/day');
//    iteración x cada elemento
  const movies = data.results;

 createMovies(movies, genericSection);

}


// Poster y description de cada una de las imagenes
async function getMovieById(id) {
  const { data: movie } = await api('movie/' + id);

const movieImgUrl = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;
console.log(movieImgUrl);
headerSection.style.background = `
  linear-gradient(
    180deg,
     rgba(0, 0, 0, 0.35) 19.27%, 
     rgba(0, 0, 0, 0) 29.17%
     ), 
     url(${movieImgUrl})`;

  movieDetailTitle.textContent = movie.title;
  movieDetailDescription.textContent = movie.overview;
  movieDetailScore.textContent = movie.vote_average;

  // function createcategories llamada aqui
  createCategories(movie.genres, movieDetailCategoriesList);
  
  getRelatedMoviesId(id);

}

async function getRelatedMoviesId(id) {
  const { data } = await api(`movie/${id}/recommendations`);
  const relateMovies = data.results;

  createMovies(relateMovies, relatedMoviesContainer);
}