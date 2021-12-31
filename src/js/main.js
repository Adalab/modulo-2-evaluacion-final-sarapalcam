"use strict";

/////////////Elementos de HTML
const input = document.querySelector(".js-input");
const searchBtn = document.querySelector(".js-search-btn");
const resetBtn = document.querySelector(".js-reset-btn");
const favList = document.querySelector(".js-favorites-list");
const resetFavoritesBtn = document.querySelector(".js-reset-favorites-btn");
const resultList = document.querySelector(".js-result-list");
const headerMenu = document.querySelector(".js-header-menu");
const favoritesSection = document.querySelector(".js-favorites-section");
const resultsArrow = document.querySelector(".js-results-arrow");

/////////////Constantes globales
let favorites = [];
let results = [];

/////////////Funciones

//Tomar el valor del input
function getInputValue() {
  return input.value;
}

//Renderizar los resultados del fetch con DOM
function renderResults(results) {
  resultList.innerHTML = "";
  for (const result of results) {
    const newLi = document.createElement("li");
    newLi.id = `${result.mal_id}`;
    newLi.classList.add("js-li-results");
    newLi.classList.add("anime__results--list--el");
    const newImg = document.createElement("img");
    if (result.image_url === null || result.image_url === undefined) {
      newImg.src = "https://via.placeholder.com/225x317/ffffff/666666/?text=TV";
    } else {
      newImg.src = result.image_url;
    }
    newImg.style = "height: 317px; width: 225px; background-size: cover";
    newImg.alt = `Imagen de portada de ${result.title}`;
    newImg.title = `Imagen de portada de ${result.title}`;
    const newParagraph = document.createElement("p");
    const newParagraphContent = document.createTextNode(`${result.title}`);
    newParagraph.appendChild(newParagraphContent);
    newLi.appendChild(newImg);
    newLi.appendChild(newParagraph);
    resultList.appendChild(newLi);
    newLi.addEventListener("click", handleClickListElement);
  }
  showHighlitedResults();
}

//Hacer petición al servidor con el input de la usuaria
function fetchData() {
  const inputValue = getInputValue();
  fetch(`https://api.jikan.moe/v3/search/anime?q=${inputValue}`)
    .then((response) => response.json())
    .then((animeData) => {
      results = [];
      for (const result of animeData.results) {
        results.push(result);
      }
      renderResults(results);
    });
}

//Alternar la clase de favoritos al clicar en los elemetos de resultados
function toggleFavoriteClass(ev) {
  ev.currentTarget.classList.toggle("favorite");
}

//Crear un nuevo objeto de favoritos al clicar sobre un elemeto de resultados
function createNewFavorite(ev) {
  let favorite = {
    id: ev.currentTarget.id,
    image_url: ev.currentTarget.childNodes[0].currentSrc,
    title: ev.currentTarget.childNodes[1].innerText,
  };
  return favorite;
}

//Guardar el array de favoritos en el localStorage
function saveFavoritesArray() {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

//Renderizar el listado de favoritos con DOM
function renderFavorites() {
  favList.classList.remove("hidden");
  favList.innerHTML = "";
  for (const favorite of favorites) {
    const newLi = document.createElement("li");
    newLi.id = `${favorite.id}`;
    newLi.classList.add("anime__favorites--list--el");
    const newDiv = document.createElement("div");
    newDiv.classList.add("anime__favorites--list--container");
    const newImg = document.createElement("img");
    newImg.src = favorite.image_url;
    newImg.style = "height: 170px; width: 121px; background-size: cover";
    newImg.alt = `Imagen de portada de ${favorite.title}`;
    newImg.title = `Imagen de portada de ${favorite.title}`;
    const newParagraph = document.createElement("p");
    const newParagraphContent = document.createTextNode(`${favorite.title}`);
    const newIcon = document.createElement("i");
    newIcon.classList.add("fas");
    newIcon.classList.add("fa-times-circle");
    newIcon.classList.add("js-remove_favorite");
    newIcon.classList.add("anime__favorites--list--remove");
    newParagraph.appendChild(newParagraphContent);
    newDiv.appendChild(newImg);
    newDiv.appendChild(newParagraph);
    newLi.appendChild(newDiv);
    newLi.appendChild(newIcon);
    favList.appendChild(newLi);
    const removeIcon = document.querySelectorAll(".js-remove_favorite");
    for (const icon of removeIcon) {
      icon.addEventListener("click", handleClickRemoveIcon);
    }
  }
  saveFavoritesArray();
}

//Añadir un nuevo objeto al array de favoritos (si no está ya marcado como favorito) al clicar sobre un elemento de resultados
function addToFavorites(ev) {
  const favorite = createNewFavorite(ev);
  const selectedAnimeId = ev.currentTarget.id;
  const favoriteAnime = favorites.find((fav) => fav.id === selectedAnimeId);
  if (favoriteAnime === undefined) {
    favorites.push(favorite);
  } else {
    const favoriteAnimeIndex = favorites.findIndex(
      (fav) => fav.id === selectedAnimeId
    );
    favorites.splice(favoriteAnimeIndex, 1);
  }
  renderFavorites(favorite);
}

//Eliminar el estilo de los favoritos en la lista de resultados al clicar en las "x" de favoritos
function deleteHighlitedResults(ev) {
  const selectedFavoriteId = ev.currentTarget.parentNode.id;
  const renderedResultsLi = document.querySelectorAll(".js-li-results");
  for (const item of renderedResultsLi) {
    if (selectedFavoriteId === item.id) {
      item.classList.remove("favorite");
    }
  }
}

//Eliminar un elemento del array de favoritos al clicar en las "x" de favoritos
function removeFromFavorites(ev) {
  const selectedFavoriteId = ev.currentTarget.parentNode.id;
  const favoriteAnimeIndex = favorites.findIndex(
    (fav) => fav.id === selectedFavoriteId
  );
  favorites.splice(favoriteAnimeIndex, 1);
  deleteHighlitedResults(ev);
  renderFavorites();
}

//Borrar el input y la lista de resultados
function resetResults() {
  input.value = "";
  resultList.innerHTML = "";
}

//Eliminar el estilo de todos los favoritos en la lista de resultados al clicar sobre el botón de "borrar favoritos"
function deleteAllHighlitedResults() {
  const renderedResultsLi = document.querySelectorAll(".js-li-results");
  for (const item of renderedResultsLi) {
    item.classList.remove("favorite");
  }
}

//Eliminar del array, del localStorage, y de la pantalla todo el listado de favoritos al clicar sobre el botón de "borrar favoritos"
function removeAllFavorites() {
  favorites = [];
  localStorage.clear("favorites");
  deleteAllHighlitedResults();
  renderFavorites();
}

//Mostrar el estilo de todos los favoritos en la lista de resultados aunque cambiemos de búsqueda o recarguemos la página
function showHighlitedResults() {
  const renderedResultsLi = document.querySelectorAll(".js-li-results");
  for (const item of renderedResultsLi) {
    for (const favorite of favorites) {
      if (favorite.id === item.id) {
        item.classList.add("favorite");
      }
    }
  }
}

//Recuperar el listado de favoritos del localStorage al recargar la página
function restoreSavedFavorites() {
  if (localStorage.getItem("favorites") !== null) {
    favorites = JSON.parse(localStorage.getItem("favorites"));
    renderFavorites();
  }
}

//Alternar la visibilidad de la sección de favoritos
function toggleShowFavorites() {
  favoritesSection.classList.toggle("hidden");
}

//Alternar la rotación del icono del menú del header (mobile)
function toggleMenuRotation() {
  headerMenu.classList.toggle("rotate");
}

//Alternar el color del icono del menú del header al hacer scroll (mobile)
function changeColorMenu() {
  if (window.scrollY > 130) {
    headerMenu.classList.add("black");
  } else if (headerMenu.getBoundingClientRect(0, 130)) {
    headerMenu.classList.remove("black");
  }
}

//Hacer scroll hasta el inicio al clicar en los iconos del menú del header y del final de resultados
function scrollToTop() {
  window.scrollTo(0, 0);
}

/////////////Funciones manejadoras de eventos
function handleClickSearch(ev) {
  ev.preventDefault();
  fetchData();
  resultsArrow.classList.remove("hidden");
}

function handleClickListElement(ev) {
  toggleFavoriteClass(ev);
  addToFavorites(ev);
}

function handleClickRemoveIcon(ev) {
  removeFromFavorites(ev);
}

function handleClickReset(ev) {
  ev.preventDefault();
  resetResults();
  resultsArrow.classList.add("hidden");
}

function handleClickResetFavs(ev) {
  ev.preventDefault();
  removeAllFavorites();
  toggleMenuRotation();
  favoritesSection.classList.add("hidden");
}

function handleClickHeader() {
  toggleShowFavorites();
  toggleMenuRotation();
  scrollToTop();
}

function handleScrollHeader() {
  changeColorMenu();
}

function handleClickArrow() {
  scrollToTop();
}

//Funciones a las que llamamos nosotras: recuperar los datos del localStorage
restoreSavedFavorites();

/////////////Eventos
searchBtn.addEventListener("click", handleClickSearch);
resetBtn.addEventListener("click", handleClickReset);
resetFavoritesBtn.addEventListener("click", handleClickResetFavs);
document.addEventListener("scroll", handleScrollHeader);
headerMenu.addEventListener("click", handleClickHeader);
resultsArrow.addEventListener("click", handleClickArrow);
