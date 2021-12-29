"use strict";

//Cosas que faltan por hacer:
///////En general está todo bastante poco elegante, si sobre tiempo intentar mejorar el código, creo que la clave es crear un objetos para cada serie favorita y meter eso en el array. Separar funciones, evitar "for", renombrar elementos, evitar guardar HTML en local storage
///////Includes en HTML, CSS y JS
///////CSS
///////Extras si me da tiempo: modo noche, versión responsive (que en el móvil los favoritos estén ocultos y los podamos desplegar abriendo un menú)

///////////////////////////////////////////////Traemos los elementos que necesitamos de HTML
const input = document.querySelector(".js-input");
const searchBtn = document.querySelector(".js-search-btn");
const resetBtn = document.querySelector(".js-reset-btn");
const favList = document.querySelector(".js-favorites-list");
const resetFavoritesBtn = document.querySelector(".js-reset-favorites-btn");
const resultList = document.querySelector(".js-result-list");

/////////////////////////////////////////////////Creamos nuestas constantes globales
let favorites = [];

///////////////////////////////////////////////Funciones

//Pinta los elementos marcados como favoritos en resultados y guardados en el localstorage
function renderFavoriteHighliht(allLiEl) {
  let results = [];
  for (const item of allLiEl) {
    results.push(item.id);
  }
  console.log(results);
  for (const favorite of favorites) {
    const findFavorite = results.find((row) => row === favorite);
    console.log(findFavorite);
    for (const liItem of allLiEl) {
      if (findFavorite === liItem.id) {
        liItem.classList.add("favorite");
      }
    }
  }
}

function renderResults(animeData) {
  resultList.innerHTML = "";
  for (const data of animeData) {
    const newLiEl = document.createElement("li");
    newLiEl.id = `${data.mal_id}`;
    newLiEl.classList.add("js-li-results");
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
    newImgEl.title = `Imagen de portada de ${data.title}`; //TENGO QUE PONER ESTOS ELEMENTOS DE LAS IMÁGENES EN FAVORITOS
    const newParagraphContent = document.createTextNode(`${data.title}`);
    newParagraphEl.appendChild(newParagraphContent);
    newLiEl.appendChild(newImgEl);
    newLiEl.appendChild(newParagraphEl);
    resultList.appendChild(newLiEl);
    //Evento para añadir a favoritos una serie
    newLiEl.addEventListener("click", handleClickResultList);
  }
  const allLiEl = document.querySelectorAll(".js-li-results");
  renderFavoriteHighliht(allLiEl);
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
  resultList.classList.remove("hidden");
}

//Muestra la sección de favoritos
function showFavorites() {
  favList.classList.remove("hidden");
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
  const favoriteAnimeData = favorites.find((row) => row === selectedAnimeId);
  if (favoriteAnimeData === undefined) {
    favorites.push(ev.currentTarget.id);
    renderFavorite(ev);
  } else {
    const findAnimeId = favorites.findIndex((row) => row === selectedAnimeId);
    favorites.splice(findAnimeId, 1);
    favList.childNodes[findAnimeId].outerHTML = "";
  }
}

//Elimina el elemenro de favoritos del array y elimina la clase "favorite" de el li
function removeFavoriteFromArray(ev) {
  const findAnimeId = favorites.findIndex(
    (row) => row === ev.currentTarget.parentNode.id
  );
  const favoriteRemoved = favorites.splice(findAnimeId, 1);
  const resultListChilds = resultList.childNodes;
  //Si me sobra tiempo, intentar hacer esto con find
  for (const result of resultListChilds) {
    if (result.id === favoriteRemoved[0]) {
      result.classList.remove("favorite");
    }
  }
}

//Elimina visualmente un elemento de la lista de favoritos
function removeFavoriteRender(ev) {
  ev.currentTarget.parentNode.outerHTML = "";
}

//Recupera los datos de favoritos del local storage
function renderFavs() {
  showFavorites();
  favorites = JSON.parse(localStorage.getItem("favorites"));
  favList.innerHTML = localStorage.getItem("favorites_html");
}

//Si tenemos algo en el local stotage, llama a renderFavs para recuperar los datos de favoritos
if (localStorage.getItem("favorites_html") !== null) {
  renderFavs();
}

///////////////////////////////////////////////Funciones manejadoras de eventos

//Elimina el título y la portada de la lista de favoritos y el elemento favorito del array favorites
function handleClickRemove(ev) {
  removeFavoriteFromArray(ev);
  removeFavoriteRender(ev);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  localStorage.setItem("favorites_html", favList.innerHTML);
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
  localStorage.setItem("favorites", JSON.stringify(favorites));
  localStorage.setItem("favorites_html", favList.innerHTML);
}

//Borra el input y la lista de resultados
function handleResetBtn(ev) {
  ev.preventDefault();
  input.value = "";
  resultList.innerHTML = "";
}

//Borra visualmente, del array y del local storage todos los favoritos
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
  localStorage.clear("favorites");
}
///////////////////////////////////////////////Eventos

searchBtn.addEventListener("click", handleClickSearch);
resetBtn.addEventListener("click", handleResetBtn);
resetFavoritesBtn.addEventListener("click", handleResetFavoritesBtn);
