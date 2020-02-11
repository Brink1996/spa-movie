"use strict";

const url = "http://api.brinktest.dk/wordpress/wp-json/acf/v3/posts?per_page=100"

let movies = [];
let _users;
let _selectedUser;

  fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      console.log(json);
      appendMovies(json);
      movies = json;
      _users = json;
    });

  // append wp posts to the DOM
function appendMovies(posts) {
  let htmlTemplate = "";
  for (let post of posts) {
    console.log(post);
    htmlTemplate += `
      <article>
        <img src="${post.acf.img.url}"></img>
        <div class="movie_info">
        <h3>${post.acf.title}</h3>
        <p>${post.acf.Director}</p>
        </div>
        <div class="${post.acf.view_status}"></div>
        <div class="overlay"></div>
      </article>
    `;
  }
  document.querySelector('#movies_container').innerHTML = htmlTemplate;
}

// toggle class fuction - reveal search
function toggleSearch(){
  console.log("click")
  let movieadd = document.querySelector("#searchbar");
  movieadd.classList.toggle("show");
}

// search function

function search(value) {
  let searchQuery = value.toLowerCase();
  let filteredMovies = [];
  for (let movie of movies) {
    let title = movie.acf.title.toLowerCase();
    if (title.includes(searchQuery)) {
      filteredMovies.push(movie);
    }
  }
  console.log(filteredMovies);
  appendMovies(filteredMovies);
}

// genres

function getGenres() {
  fetch('http://api.brinktest.dk/wordpress/wp-json/wp/v2/categories')
    .then(function(response) {
      return response.json();
    })
    .then(function(categories) {
      console.log(categories);
      appendGenres(categories);
    });
}

getGenres();

// append all genres as select options (dropdown)
function appendGenres(genres) {
  let htmlTemplate = "";
  for (let genre of genres) {
    htmlTemplate += `
      <option value="${genre.id}">${genre.name}</option>
    `;
  }

  document.querySelector('#select-genre').innerHTML += htmlTemplate;
}



// genre selected event - fetch movies by selected category
function genreSelected(genreId) {
  console.log(`Genre ID: ${genreId}`);
  if (genreId) {
    fetch(`http://api.brinktest.dk/wordpress/wp-json/wp/v2/posts?_embed&categories=${genreId}`)
      .then(function(response) {
        return response.json();
      })
      .then(function(movies) {
        console.log(movies);
        appendMoviesByGenre(movies);
      });
  }
}

// append movies by genre
function appendMoviesByGenre(postsByGenre) {
  let htmlTemplate = "";

  for (let post of postsByGenre) {
    htmlTemplate += `
    <article>
      <img src="${post.acf.img.url}"></img>
      <div class="movie_info">
      <h3>${post.acf.title}</h3>
      <p>${post.acf.Director}</p>
      </div>
      <div class="${post.acf.view_status}"></div>
      <div class="overlay"></div>
    </article>
    `;
  }
  // if no movies, display feedback to the user
  if (postsByGenre.length === 0) {
    htmlTemplate = `
      <p>No Movies</p>
    `;
  }

  document.querySelector('#movies-by-genre-container').innerHTML = htmlTemplate;
}

genreSelected(5);

async function loadData() {
  let response = await fetch("https://randomuser.me/api/?results=9");
  let jsonData = await response.json();
  _users = jsonData.results;
  appendPersons(jsonData.results);
}

function showDetailView(index){
  _selectedUser = _users[index];
  document.querySelector("#detail-view").innerHTML = `
  <header class="topbar">
      <h2>${_selectedUser.name.first} ${_selectedUser.name.last}</h2>
  </header>
  <article>
      <img src="${_selectedUser.picture.large}">
      <h4>${_selectedUser.name.first} ${_selectedUser.name.last}</h4>
      <p><a href="mailto:${_selectedUser.email}">${_selectedUser.email}</a></p>
      </article>
  `;
  navigateTo("detail-view");
}
