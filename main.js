//VARIABLES
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const myWatchLists = document.getElementById('myWatchLists');
const mainOutput = document.getElementById('mainOutput');
const loading = document.getElementById('loading');
const movieCarousel = document.getElementById('movieCarousel');



//INITIAL

//EVENTLISTENER to SEARCH MOVIES
searchForm.addEventListener('submit', searchMovies);

function searchMovies(e) {
  e.preventDefault();
  
  let search = searchInput.value;
  getMovies(search);
  clearPastSearch();
}

// EVENTLISTENER for default MOVIES
document.addEventListener('DOMContentLoaded', defaultMovies);

//DEFAULT MOVIES
function defaultMovies() {

  let defaultMovie = 'love';

  axios.get(`//www.omdbapi.com/?s=${defaultMovie}&apikey=7be259d3`)
  .then(response => {
      
      let movies = response.data.Search;
      // console.log(movies)
      movies.forEach(function(movie) {
      let movieId = movie.imdbID;
      getMovieDetails(movieId);

      })
      
  })

  .catch(err => console.log(err));
}

//GET MOVIES
function getMovies(search) {
  axios.get(`//www.omdbapi.com?s=${search}&apikey=7be259d3`)
  .then(response => {
    
    let movies = response.data.Search;
    console.log(movies)
    movies.forEach(function(movie) {
    let movieId = movie.imdbID;
    getMovieDetails(movieId);

    })
  })

  .catch(err => console.log(err));
}

//GET MOVIE DETAILS
function getMovieDetails(movieId) {
  axios.get(`//www.omdbapi.com?i=${movieId}&apikey=7be259d3`)
  .then(response => {
    
    let movieData = response.data;
    let output = '';
    let movieRatingColor = movieData.imdbRating > 7.5 ? `<div class="circle green p-2">
            <h4 class="text-center text-white mb-0 pt-2">${movieData.imdbRating}</h4>
            <p class="text-white text-center">ImDb</p>
            </div>` : `<div class="circle grey p-2">
            <h4 class="text-center text-white  mb-0 pt-2">${movieData.imdbRating}</h4>
            <p class="text-white text-center">ImDb</p>
            </div>`;
    let image = movieData.Poster !== 'N/A' ? `${movieData.Poster}` : `img/Movie_night.jpg`;

    output = `<div class="card my-3">
                <div class="row p-4">
                  <div class="col-md-3">
                  <img src="${image}" class="img-fluid mb-4" style="box-shadow: 1px 1px 3px 0 rgba(0,0,0,.3)">
                  </div>
                  <div class="col-md-7">
                    <div class="d-flex">
                      <h5 class="mr-auto">${movieData.Title}</h5>
                      <small>${movieData.Year}</small>
                    </div>
                    <p class="text-justify">${movieData.Plot}</p>
                    <p class="font-weight-bold">Genre: <span style="color:blueviolet">${movieData.Genre}</span></p>
                    
                    <button type="button" class="btn btn-info btn-sm mb-3" data-toggle="modal" data-target="#${movieData.imdbID}">
                      Movie Info
                    </button>
                  </div>
                  <div class="col-md-2">
                    ${movieRatingColor}
                  </div>
                </div>
                
                <div class="modal fade" id="${movieData.imdbID}" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered modal-lg " role="document">

                      <div class="modal-content">
                        
                        <div class="container p-5">

                        <div class="row">
                          <div class="col-md-4">
                            <img src="${image}" class="img-fluid">
                            <p class="pt-2 text-center">Follow on</p>
                            <div class="d-flex justify-content-around">
                              <i class="fab fa-facebook-f"></i>
                              <i class="fab fa-twitter"></i>
                              <i class="fab fa-instagram"></i>
                            </div>
                          </div>

                          <div class="col-md-8">
                          <h3 class="modal-title font-weight-bold">${movieData.Title}</h3>
                          <p class="font-weight-bold"  style="color: #000"se>${movieData.Year} | <a href="index.html" style="color: #00f">${movieData.Genre}</a></p>
                          <hr>

                          <p><span class="font-weight-bold" style="color: orange">${(movieData.Type).toUpperCase()}</span> ${movieData.Plot}</p>

                          <p style="color: #f00"><span class="font-weight-bold">Rated : </span>${movieData.Rated}</p>

                          <div class="bg-warning  p-2 d-inline">
                            <p class="d-inline"><a href="http://imdb.com/title/${movieData.imdbID}" target="_blank" class="text-white">IMDb : ${movieData.imdbRating} / 10</a></p>
                          </div>

                          <p class="pt-5 mb-0"><span class="font-weight-bold" style="color: #000">Runtime : </span>${movieData.Runtime}</p>
                          <p class="pt-3 mb-0"><span class="font-weight-bold" style="color: #000">Actors : </span>${movieData.Actors}</p>
                          <p class="pt-3 mb-0"><span class="font-weight-bold" style="color: #000">Director : </span>${movieData.Director}</p>
                          </div>
                        </div>

                        <div class="modal-footer pt-5">
                          <button type="button" class="addWatchList btn btn-outline-success" data-dismiss="modal"><i class="fas fa-plus-circle"></i> Add to Watchlist</button>
                          <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                        </div>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>`;

    document.getElementById('output').innerHTML += output;
    // console.log(movieData);


    // ADD TO myWatchLists
    let addWatchList = document.querySelectorAll('.addWatchList');
    if(addWatchList) {
      addWatchList.forEach(function(add) {
        add.addEventListener('click', function(e) {
          let addMovieId = e.target.parentNode.parentNode.children[0].children[1].children[0].textContent;
          let addMovieThumb = e.target.parentNode.parentNode.children[0].children[0].children[0].src;
          console.log(addMovieThumb);
          myWatchLists.innerHTML += `<li class="list-group-item mt-2 px-0">
                                      <div class="d-flex align-items-center">
                                        <div class="pr-2"><img src="${addMovieThumb}" class="thmbnail"></div>
                                        <div class="mr-auto">${addMovieId}</div>
                                        <div><i class="far fa-times-circle"></i></div>
                                      </div>
                                    </li>`
        })
      })
    }
  })
  .catch(err => console.log(err));
}

// CLEAR PAST SEARCHES
function clearPastSearch() {
  document.getElementById('output').innerHTML = '';
  
}

 //DELETE from myWatchLists
 myWatchLists.addEventListener('click', function(e) {
   if(e.target.className === 'far fa-times-circle') {
     e.target.parentNode.parentNode.parentNode.remove();
   }
 })

//  ANY GENRE
document.getElementById('any').addEventListener('click', function() {
  console.log('click any genre!')

})




