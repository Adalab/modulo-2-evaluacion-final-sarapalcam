"use strict";

//Reducir variables, declarar sentencias fuera de los for, meter ifs en bucles si se puede, ver como puedo poner comillas simples sin que me lo cambie prettier, comprobar que no tengo variables locales con el mismo nombre
//Evitar tener estructura duplicadas a lo largo del programa y refactorizarlas por funciones o clases que centralicen este tipo de código.

/////////////1. Elementos de HTML
const input = document.querySelector(".js-input");
const searchBtn = document.querySelector(".js-search-btn");
const resetBtn = document.querySelector(".js-reset-btn");
const favList = document.querySelector(".js-favorites-list");
const resetFavoritesBtn = document.querySelector(".js-reset-favorites-btn");
const resultList = document.querySelector(".js-result-list");
const headerMenu = document.querySelector(".js-header-menu");
const favoritesSection = document.querySelector(".js-favorites-section");
const resultsArrow = document.querySelector(".js-results-arrow");
const body = document.querySelector(".js-body");

/////////////2. Constantes globales
let favorites = [];
let results = [];

/////////////3. Funciones

/////////////3.1. Funciones para la petición al servidor

//Tomar el valor del input
function getInputValue() {
  return input.value;
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

/////////////3.2. Funciones para renderizar los resultados

//Funciones para renderizar los resultados del fetch con DOM
function setDefaultImage(url, imgElement) {
  if (url === null) {
    imgElement.src =
      "https://via.placeholder.com/225x317/ffffff/666666/?text=TV";
  } else {
    imgElement.src = url;
  }
}

function createCoverImgResult(result) {
  const newImgResult = document.createElement("img");
  setDefaultImage(result.image_url, newImgResult);
  newImgResult.style = "height: 317px; width: 225px; background-size: cover";
  newImgResult.alt = `Imagen de portada de ${result.title}`;
  newImgResult.title = `Imagen de portada de ${result.title}`;
  return newImgResult;
}

function createParagraphResult(result) {
  const newParagraphResult = document.createElement("p");
  const newParagraphResultContent = document.createTextNode(`${result.title}`);
  newParagraphResult.appendChild(newParagraphResultContent);
  return newParagraphResult;
}

function createFavoritesImgResult() {
  const newImgFavResult = document.createElement("img");
  newImgFavResult.src = "./assets/images/favorite.png";
  newImgFavResult.alt = "Corazón de favorito";
  newImgFavResult.title = "Corazón de favorito";
  newImgFavResult.classList.add("anime__results--list--heart");
  newImgFavResult.classList.add("hidden");
  return newImgFavResult;
}

function appendElementsToResult(result, liElement) {
  const newLiCover = createCoverImgResult(result);
  const newLiTitle = createParagraphResult(result);
  const newLiFavoriteImg = createFavoritesImgResult();
  liElement.appendChild(newLiCover);
  liElement.appendChild(newLiTitle);
  liElement.appendChild(newLiFavoriteImg);
}

function addListenerToResultLi(resultLi) {
  resultLi.addEventListener("click", handleClickListElement);
}

function createLiResult(result) {
  const newLiResult = document.createElement("li");
  newLiResult.id = `${result.mal_id}`;
  newLiResult.classList.add("js-li-results");
  newLiResult.classList.add("anime__results--list--el");
  appendElementsToResult(result, newLiResult);
  addListenerToResultLi(newLiResult);
  return newLiResult;
}

//Renderizar los resultados del fetch con DOM
function renderResults(results) {
  resultList.innerHTML = "";
  for (const result of results) {
    const newLiElement = createLiResult(result);
    resultList.appendChild(newLiElement);
  }
  showHighlitedResults();
}

//Alternar la clase de favoritos al clicar en los elemetos de resultados
function toggleFavoriteClass(ev) {
  ev.currentTarget.classList.toggle("favorite");
  ev.currentTarget.childNodes[2].classList.toggle("hidden");
}

/////////////3.2. Funciones para crear y renderizar favoritos

//Crear un nuevo objeto de favoritos al clicar sobre un elemeto de resultados
function createNewFavoriteObject(ev) {
  let favorite = {
    id: ev.currentTarget.id,
    image_url: ev.currentTarget.childNodes[0].currentSrc,
    title: ev.currentTarget.childNodes[1].innerText,
  };
  return favorite;
}

//Añadir un nuevo objeto al array de favoritos (si no está ya marcado como favorito) al clicar sobre un elemento de resultados
function updateFavoritesList(ev) {
  const favorite = createNewFavoriteObject(ev);
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
}

//Funciones para renderizar el listado de favoritos con DOM
function createCoverFavorite(favorite) {
  const newImgFav = document.createElement("img");
  newImgFav.src = favorite.image_url;
  newImgFav.style = "height: 170px; width: 121px; background-size: cover";
  newImgFav.alt = `Imagen de portada de ${favorite.title}`;
  newImgFav.title = `Imagen de portada de ${favorite.title}`;
  return newImgFav;
}

function createParagraphFavorite(favorite) {
  const newParagraphFav = document.createElement("p");
  const newParagraphFavContent = document.createTextNode(`${favorite.title}`);
  newParagraphFav.appendChild(newParagraphFavContent);
  return newParagraphFav;
}

function appendElementsToFavoriteDiv(favorite, divElement) {
  const coverFavorite = createCoverFavorite(favorite);
  const titleFavorite = createParagraphFavorite(favorite);
  divElement.appendChild(coverFavorite);
  divElement.appendChild(titleFavorite);
  return divElement;
}

function createDivFavorite(favorite) {
  const newDivFav = document.createElement("div");
  newDivFav.classList.add("anime__favorites--list--container");
  const divFav = appendElementsToFavoriteDiv(favorite, newDivFav);
  return divFav;
}

function createRemoveIconFavorite() {
  const newIconFav = document.createElement("i");
  newIconFav.classList.add("fas");
  newIconFav.classList.add("fa-times-circle");
  newIconFav.classList.add("js-remove-favorite");
  newIconFav.classList.add("anime__favorites--list--remove");
  return newIconFav;
}

function appendElementsToFavoriteList(favorite, liElement) {
  const divElement = createDivFavorite(favorite);
  const removeIcon = createRemoveIconFavorite();
  liElement.appendChild(divElement);
  liElement.appendChild(removeIcon);
}

function createLiFavorite(favorite) {
  const newLiFav = document.createElement("li");
  newLiFav.id = `${favorite.id}`;
  newLiFav.classList.add("anime__favorites--list--el");
  appendElementsToFavoriteList(favorite, newLiFav);
  return newLiFav;
}

function addListenerToRemoveIcons() {
  const removeIcon = document.querySelectorAll(".js-remove-favorite");
  for (const icon of removeIcon) {
    icon.addEventListener("click", handleClickRemoveIcon);
  }
  updateStatusResetBtn();
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
    const favoriteLiElement = createLiFavorite(favorite);
    favList.appendChild(favoriteLiElement);
  }
  addListenerToRemoveIcons();
  saveFavoritesArray();
}

//
function addToFavorites(ev) {
  updateFavoritesList(ev);
  renderFavorites();
}

//Eliminar el estilo de los favoritos en la lista de resultados al clicar en las "x" de favoritos
function deleteHighlitedResults(ev) {
  const selectedFavoriteId = ev.currentTarget.parentNode.id;
  const renderedResultsLi = document.querySelectorAll(".js-li-results");
  for (const item of renderedResultsLi) {
    if (selectedFavoriteId === item.id) {
      item.classList.remove("favorite");
      item.childNodes[2].classList.add("hidden");
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
    item.childNodes[2].classList.add("hidden");
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
        item.childNodes[2].classList.remove("hidden");
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

//Funciones para activar o desactivar el botón de "borrar favoritos"
function turnResetBtnOn() {
  resetFavoritesBtn.classList.remove("anime__favorites--btn--off");
  resetFavoritesBtn.classList.add("anime__favorites--btn--on");
}

function turnResetBtnOff() {
  resetFavoritesBtn.classList.add("anime__favorites--btn--off");
  resetFavoritesBtn.classList.remove("anime__favorites--btn--on");
}

function enableResetFavoritesBtn() {
  resetFavoritesBtn.disabled = false;
  turnResetBtnOn();
}

function disableResetFavoritesBtn() {
  resetFavoritesBtn.disabled = true;
  turnResetBtnOff();
}

function updateStatusResetBtn() {
  if (favList.innerHTML === "") {
    disableResetFavoritesBtn();
  } else {
    enableResetFavoritesBtn();
  }
}

//Funciones que alternan el overflow del body y de la lista de favoritos para que en versión móvil no haya scroll más allá de favoritos
function toggleOverflowFavorites() {
  favoritesSection.classList.toggle("overflow__scroll");
}

function removeOverflow() {
  body.classList.remove("overflow__hidden");
  favoritesSection.classList.remove("overflow__scroll");
}

function toggleOverflowBody() {
  body.classList.toggle("overflow__hidden");
}

//Alternar la visibilidad de la sección de favoritos
function toggleShowFavorites() {
  favoritesSection.classList.toggle("hidden");
}

//Alternar la rotación del icono del menú del header (mobile)
function toggleMenuRotation() {
  headerMenu.classList.toggle("rotate");
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
  enableResetFavoritesBtn();
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
  removeOverflow();
  removeAllFavorites();
  toggleMenuRotation();
  favoritesSection.classList.add("hidden");
}

function handleClickHeader() {
  toggleOverflowBody();
  toggleOverflowFavorites();
  toggleShowFavorites();
  toggleMenuRotation();
  scrollToTop();
}

function handleClickArrow() {
  scrollToTop();
}

//Funciones a las que llamamos nosotras: recuperar los datos del localStorage
restoreSavedFavorites();
updateStatusResetBtn();

/////////////Eventos
searchBtn.addEventListener("click", handleClickSearch);
resetBtn.addEventListener("click", handleClickReset);
resetFavoritesBtn.addEventListener("click", handleClickResetFavs);
headerMenu.addEventListener("click", handleClickHeader);
resultsArrow.addEventListener("click", handleClickArrow);
