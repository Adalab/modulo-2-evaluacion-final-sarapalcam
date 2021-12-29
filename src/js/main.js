"use strict";

//Cosas que faltan por hacer:
///////Separar más las funciones, cambiar for of por fins siempre que sea posible
///////LocalStorage de las series favoritas, que también aparezcan marcadas en la lista de resultados si aparecen en la búsqueda -> También tendrán que eliminarse del localStorage cuando las eliminemos de la lista
///////Que las series favoritas sigan marcadas como tal en resultados (esto creo que es con el local storage)
///////CSS
///////Extras si me da tiempo: modo noche, versión responsive (que en el móvil los favoritos estén ocultos y los podamos desplegar abriendo un menú)

///////////////////////////////////////////////Traemos los elementos que necesitamos de HTML

const input = document.querySelector(".js-input");
const searchBtn = document.querySelector(".js-search-btn");
const resetBtn = document.querySelector(".js-reset-btn");
const favSection = document.querySelector(".js-favorites-section");
const resultSection = document.querySelector(".js-result-section");
const favList = document.querySelector(".js-favorites-list");
const resetFavoritesBtn = document.querySelector(".js-reset-favorites-btn");
const resultList = document.querySelector(".js-result-list");

/////////////////////////////////////////////////Creamos nuestas constantes globales
let favorites = [];
let numbers = [1, 35, 46, 23, 57];
///////////////////////////////////////////////Funciones

//Pinta las portadas y títulos en la lista de resultados a través de DOM avanzado
function renderResults(animeData) {
  resultList.innerHTML = "";
  for (const data of animeData) {
    const newLiEl = document.createElement("li");
    newLiEl.id = `${data.mal_id}`;
    const newImgEl = document.createElement("img");
    const newParagraphEl = document.createElement("p");
    if (data.image_url === null || data.image_url === undefined) {
      newImgEl.src =
        "https://via.placeholder.com/225x317/ffffff/666666/?text=TV";
    } else {
      newImgEl.src = data.image_url;
    }
    newImgEl.style = "height: 317px; width: 225px; background-size: cover";
    newImgEl.alt = `Imagen de portada de ${data.title}`;
    newImgEl.title = `Imagen de portada de ${data.title}`;
    const newParagraphContent = document.createTextNode(`${data.title}`);
    newParagraphEl.appendChild(newParagraphContent);
    newLiEl.appendChild(newImgEl);
    newLiEl.appendChild(newParagraphEl);
    resultList.appendChild(newLiEl);
    //results.push(newLiEl);
    //Evento para añadir a favoritos una serie
    newLiEl.addEventListener("click", handleClickResultList);
  }
}

//Toma el valor que la usuaria introduce en la barra de búsqueda
function getInputValue() {
  return input.value;
}

//Toma los datos de las series de una API en función del input de búsqueda de la usuaria
function fetchResults() {
  const inputValue = getInputValue();
  fetch(`https://api.jikan.moe/v3/search/anime?q=${inputValue}`)
    .then((response) => response.json())
    .then((animeDataFetch) => {
      renderResults(animeDataFetch.results);
    });
}

//Muestra la sección de resultados
function showResults() {
  resultSection.classList.remove("hidden");
}

//Muestra la sección de favoritos
function showFavorites() {
  favSection.classList.remove("hidden");
}

//Señala las series marcadas o desmarcadas como favoritas
function highlightFavorite(ev) {
  ev.currentTarget.classList.toggle("favorite");
}

//Añade listeners a todos los iconos de elimiar de favoritos
function removeFavorites(icons) {
  for (const icon of icons) {
    icon.addEventListener("click", handleClickRemove);
  }
}

//Pinta las portadas y títulos de las series marcadas como favoritas
function renderFavorite(ev) {
  showFavorites();
  favList.innerHTML += `<li id="${ev.currentTarget.id}">${ev.currentTarget.innerHTML} <i class="far fa-times-circle remove_favorite"></i></li>`;
  const removeIcons = document.querySelectorAll(".remove_favorite");
  removeFavorites(removeIcons);
}

//Añade al array de favoritos las series marcadas como favoritas
function addFavorite(ev) {
  const selectedAnimeId = ev.currentTarget.id;
  const favoriteAnimeData = favorites.find((row) => row.id === selectedAnimeId);
  if (favoriteAnimeData === undefined) {
    favorites.push(ev.currentTarget);
    renderFavorite(ev);
  } else {
    const findAnimeId = favorites.findIndex(
      (row) => row.id === selectedAnimeId
    );
    favorites.splice(findAnimeId, 1);
    favList.childNodes[findAnimeId].innerHTML = "";
  }
  //localStorage.setItem("favoritos", favList.innerHTML);
}

function removeFavoriteFromArray(ev) {
  const findAnimeId = favorites.findIndex(
    (row) => row.id === ev.currentTarget.parentNode.id
  );
  const favoriteRemoved = favorites.splice(findAnimeId, 1);
  const resultListChilds = resultList.childNodes;
  //Si me sobra tiempo, intentar hacer esto con find
  for (const result of resultListChilds) {
    if (result.id === favoriteRemoved[0].id) {
      result.classList.remove("favorite");
    }
  }
}

function removeFavoriteRender(ev) {
  ev.currentTarget.parentNode.outerHTML = "";
}

///////////////////////////////////////////////Funciones manejadoras de eventos

//Elimina el título y la portada de la lista de favoritos y el elemento favorito del array favorites
function handleClickRemove(ev) {
  removeFavoriteFromArray(ev);
  removeFavoriteRender(ev);
}

//Busca los resultados en la API y los muestra
function handleClickSearch(ev) {
  ev.preventDefault();
  fetchResults();
  showResults();
}

//Señala y añade al array de favoritos los favoritos
function handleClickResultList(ev) {
  highlightFavorite(ev);
  addFavorite(ev);
}

function handleResetBtn(ev) {
  ev.preventDefault();
  input.value = "";
  resultList.innerHTML = "";
}

function handleResetFavoritesBtn(ev) {
  ev.preventDefault();
  favList.innerHTML = "";
  favorites = [];
  const resultListChilds = resultList.childNodes;
  //Esto quizás lo pueda hacer con un filter en vez de con un for of
  for (const result of resultListChilds) {
    if (result.classList.contains("favorite")) {
      result.classList.remove("favorite");
    }
  }
  //localStorage.clear("favoritos");
}
///////////////////////////////////////////////Eventos

searchBtn.addEventListener("click", handleClickSearch);
resetBtn.addEventListener("click", handleResetBtn);
resetFavoritesBtn.addEventListener("click", handleResetFavoritesBtn);

//Local storage

// ¿Qué quiero guardar en el local storage?
//   1. Los elementos de la lista de resultados que tengan la clase "favorite", es decir, que se guarde esa clase aunque no estén pintados
//   2. La lista de favoritos: el array
// ¿Qué es lo que quiero recuperar al recargar la página
//   1. Cuando una serie de resultados esté en favoritos, tiene que tener esa clase y aparecer en otro color
//   2. La lista de favoritos ya renderizada

// function renderFavs() {
//   showFavorites();
//   favList.innerHTML = localStorage.getItem("favoritos");
// }
// if (localStorage.getItem("favoritos") !== null) {
//   renderFavs();
// }
//Cuando recargo la página, me recupera los favoritos pero me deja añadirlos de nuevo por lo que aparecen duplicados...
