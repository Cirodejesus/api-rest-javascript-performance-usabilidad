// Data
const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
    },
});

// LocalStorage
function likedMoviesList() {
  // Convertir de string a objeto en JS, con JSON.parse
  const item = JSON.parse(localStorage.getItem('liked_movies'));
  let movies;

  if (item) {
    movies = item;
  } else {

    movies = {}
  }

  return movies;
}
// LocalStorage
function likeMovie(movie) {
  // movie.id
 const likedMovies = likedMoviesList();

 console.log(likedMovies);

//  Pregunta de validación
if (likedMovies[movie.id]) {
  likedMovies[movie.id] = undefined; //Eliminando peli
  // console.log('la pelicula ya estaba en LS, deberiamos eliminarla');
} else {
  likedMovies[movie.id] = movie; // guardando peli
  // console.log('la pelicula no estaba en LS, deberiamos agregarla');
 }
//  Todo en localStorage debe ser un string, stringify convierte un objeto a string
 localStorage.setItem('liked_movies', JSON.stringify(likedMovies));

}

// Utils
// Con este codigo solo aparece las 3 imagenes que estan en el navegador
const lazyLoader = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
   if (entry.isIntersecting) {
   const url =  entry.target.getAttribute('data-img');
   entry.target.setAttribute('src', url);
   }
  });
});

function createMovies(
  movies, 
  container, 
  {
  lazyLoad = false, 
  clean = true
  } = {},
  ) {
 if (clean) {
  container.innerHTML = '';
 }

  movies.forEach(movie => {
   const movieContainer = document.createElement('div');
   movieContainer.classList.add('movie-container');
   
   
    const movieImg = document.createElement('img');
    movieImg.classList.add('movie-img');
    movieImg.setAttribute('alt', movie.title);
    movieImg.setAttribute(
      lazyLoad ? 'data-img' : 'src', 
      'https://image.tmdb.org/t/p/w300' + movie.poster_path,
      );
      movieImg.addEventListener('click', () => {
        location.hash = '#movie=' + movie.id;
       });
      
      //Event para imagenes rotas colocar algo mas descriptivo
      movieImg.addEventListener('error', () => {
         movieImg.setAttribute(
          'src',
          'https://static.platzi.com/static/images/error/img404.png', 
         );
      });
 
      // Creación de boton para guardar peliculas en favoritos
     const movieBtn = document.createElement('button');
     movieBtn.classList.add('movie-btn');
    //  Si mi pelicula esta en localStora guarda esta clase
     likedMoviesList() [movie.id] && movieBtn.classList.add
     ('movie-btn--liked');
     movieBtn.addEventListener('click', () => {
     movieBtn.classList.toggle('movie-btn--liked');
      // DEBERIAMOS AGREGAR LA PELICULA AL LOCALSTORAGE
      likeMovie(movie);
     })

      
      
      if (lazyLoad) {
         lazyLoader.observe(movieImg);
         }

      movieContainer.appendChild(movieImg);
      movieContainer.appendChild(movieBtn);
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

   createMovies(movies, trendingMoviesPreviewList, true);

}

async function getCategegoriesPreview() {
    const { data } = await api('genre/movie/list');
    const categories = data.genres;
    
    // Para no duplicar imagenes el en DOM
    createCategories(categories, categoriesPreviewList)
}
    
async function getMoviesByCategory(id) {
  const { data } = await api('discover/movie', {
    params: {
      with_genres: id,
    },
  });
  // infiniteScroll
  const movies = data.results;
  maxPage = data.total_pages;

  createMovies(movies, genericSection, { lazyLoad: true });
}

function getPaginatedMoviesByCategory(id) {
  return async function () {
    const {
      scrollTop,
      scrollHeight,
      clientHeight
    } = document.documentElement;
    
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
    const pageIsNotMax = page < maxPage;
  
    if (scrollIsBottom && pageIsNotMax) {
      page++;
      const { data } = await api('discover/movie', {
        params: {
          with_genres: id,
          page,
        },
      });
      const movies = data.results;
    
      createMovies(
        movies,
        genericSection,
        { lazyLoad: true, clean: false },
      );
    }
  }
}

// Consulta a la api / busqueda en el form de la pelicula que quieras
    async function getMoviesBySearch(query) {
    const { data } = await api('search/movie', {
      params: {
        query,
      }, 
    });
  // iteración x cada elemento
  // infiniteScroll
    const movies = data.results;
    maxPage = data.total_pages;
    console.log(maxPage);

   createMovies(movies, genericSection);
}


function getPaginatedMoviesBySearch(query) {
  return async function () {
    const {
      scrollTop,
      scrollHeight,
      clientHeight
    } = document.documentElement;
    
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
    const pageIsNotMax = page < maxPage;
  
    if (scrollIsBottom && pageIsNotMax) {
      page++;
      const { data } = await api('search/movie', {
        params: {
          query,
          page,
        },
      });
      const movies = data.results;
    
      createMovies(
        movies,
        genericSection,
        { lazyLoad: true, clean: false },
      );
    }
  }
}

// página de tendencias
async function getTrendingMovies() {
  const { data } = await api('trending/movie/day');
//    iteración x cada elemento
  const movies = data.results;
  maxPage = data.total_pages;
 
  createMovies(movies, genericSection, {lazyLoad: true, clean: true });

}

async function getPaginatedTrendingMovies() {
  // Infinite Scrolling
  const { 
    scrollTop, 
    scrollHeight, 
    clientHeight  
        } = document.documentElement;

const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
const pageIsNotMax = page < maxPage;

if (scrollIsBottom && pageIsNotMax) {
  page++;
  const { data } = await api('trending/movie/day', {
    params: {
    page,
    },
  });
  //    iteración x cada elemento
   const movies = data.results;
      
   createMovies(
    movies, 
    genericSection, 
    {lazyLoad: true, clean: false });

 }
}



// Poster y description de cada una de las imagenes
async function getMovieById(id) {
  const { data: movie } = await api('movie/' + id);

const movieImgUrl = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;
console.log(movieImgUrl)
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
  const relatedMovies = data.results;

  createMovies(relatedMovies, relatedMoviesContainer);
}

function getLikedMovies() {
  const likedMovies = likedMoviesList();//Se llama para que entren peliculas
  // Crea un array con todos los valores de un objeto
  const moviesArray = Object.values(likedMovies);

  createMovies(moviesArray, likedMoviesListArticle, { lazyLoad: true, clean: true });

  console.log(likedMovies);
}