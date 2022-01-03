'use strict';

/////////////3.3. Funciones para crear y renderizar favoritos

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
  const newImgFav = document.createElement('img');
  newImgFav.src = favorite.image_url;
  newImgFav.style = coverImgsStyles.favorites;
  newImgFav.alt = `Imagen de portada de ${favorite.title}`;
  newImgFav.title = `Imagen de portada de ${favorite.title}`;
  return newImgFav;
}

function createParagraphFavorite(favorite) {
  const newParagraphFav = document.createElement('p');
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
  const newDivFav = document.createElement('div');
  newDivFav.classList.add(classNames.favoritesListContainer);
  const divFav = appendElementsToFavoriteDiv(favorite, newDivFav);
  return divFav;
}

function createRemoveIconFavorite() {
  const newIconFav = document.createElement('i');
  newIconFav.classList.add('fas');
  newIconFav.classList.add('fa-times-circle');
  newIconFav.classList.add(classNames.removeFavoritesIconJs);
  newIconFav.classList.add(classNames.removeFavoritesIconCss);
  return newIconFav;
}

function appendElementsToFavoriteList(favorite, liElement) {
  const divElement = createDivFavorite(favorite);
  const removeIcon = createRemoveIconFavorite();
  liElement.appendChild(divElement);
  liElement.appendChild(removeIcon);
}

function createLiFavorite(favorite) {
  const newLiFav = document.createElement('li');
  newLiFav.id = `${favorite.id}`;
  newLiFav.classList.add(classNames.favoritesListElement);
  appendElementsToFavoriteList(favorite, newLiFav);
  return newLiFav;
}

function addListenerToRemoveIcons() {
  const removeIcon = document.querySelectorAll(`.${classNames.removeFavoritesIconJs}`);
  for (const icon of removeIcon) {
    icon.addEventListener('click', handleClickRemoveIcon);
  }
  updateStatusResetBtn();
}

//Guardar el array de favoritos en el localStorage
function saveFavoritesArray() {
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

//Renderizar el listado de favoritos con DOM
function renderFavorites() {
  favList.classList.remove(classNames.hidden);
  favList.innerHTML = '';
  let favoriteLiElement = '';
  for (const favorite of favorites) {
    favoriteLiElement = createLiFavorite(favorite);
    favList.appendChild(favoriteLiElement);
  }
  addListenerToRemoveIcons();
  saveFavoritesArray();
}

//Acutalizar y renderizar la lista de favoritos
function addToFavorites(ev) {
  updateFavoritesList(ev);
  renderFavorites();
}

//Recuperar el listado de favoritos del localStorage al recargar la página
function restoreSavedFavorites() {
  if (localStorage.getItem('favorites') !== null) {
    favorites = JSON.parse(localStorage.getItem('favorites'));
    renderFavorites();
  }
}