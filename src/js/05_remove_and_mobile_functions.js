'use strict';

/////////////3.4. Funciones relacionadas con la eliminación de elementos

//Eliminar el estilo de los favoritos en la lista de resultados al clicar en las "x" de favoritos
function deleteHighlitedResults(ev) {
  const selectedFavoriteId = ev.currentTarget.parentNode.id;
  const renderedResultsLi = document.querySelectorAll(`.${classNames.liResult}`);
  for (const item of renderedResultsLi) {
    if (selectedFavoriteId === item.id) {
      item.classList.remove(classNames.favorite);
      item.childNodes[2].classList.add(classNames.hidden);
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

//Eliminar el estilo de todos los favoritos en la lista de resultados al clicar sobre el botón de "borrar favoritos"
function deleteAllHighlitedResults() {
  const renderedResultsLi = document.querySelectorAll(`.${classNames.liResult}`);
  for (const item of renderedResultsLi) {
    item.classList.remove(classNames.favorite);
    item.childNodes[2].classList.add(classNames.hidden);
  }
}

//Eliminar del array, del localStorage, y de la pantalla todo el listado de favoritos al clicar sobre el botón de "borrar favoritos"
function removeAllFavorites() {
  favorites = [];
  localStorage.clear('favorites');
  deleteAllHighlitedResults();
  renderFavorites();
}

//Mostrar el estilo de todos los favoritos en la lista de resultados aunque cambiemos de búsqueda o recarguemos la página
function showHighlitedResults() {
  const renderedResultsLi = document.querySelectorAll(`.${classNames.liResult}`);
  for (const item of renderedResultsLi) {
    for (const favorite of favorites) {
      if (favorite.id === item.id) {
        item.classList.add(classNames.favorite);
        item.childNodes[2].classList.remove(classNames.hidden);
      }
    }
  }
}

//Funciones para activar o desactivar el botón de "borrar favoritos"
function turnResetBtnOn() {
  resetFavoritesBtn.classList.remove(classNames.btnOff);
  resetFavoritesBtn.classList.add(classNames.btnOn);
}

function turnResetBtnOff() {
  resetFavoritesBtn.classList.add(classNames.btnOff);
  resetFavoritesBtn.classList.remove(classNames.btnOn);
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
  if (favList.innerHTML === '') {
    disableResetFavoritesBtn();
  } else {
    enableResetFavoritesBtn();
  }
}

//Borrar el input y la lista de resultados
function resetResults() {
  input.value = '';
  resultList.innerHTML = '';
}

/////////////3.5. Funciones que se activan en la versión móvil de la web

//Funciones que alternan el overflow del body y de la lista de favoritos para que en versión móvil no haya scroll más allá de favoritos
function toggleOverflowFavorites() {
  favoritesSection.classList.toggle(classNames.overflowScroll);
}

function removeOverflow() {
  body.classList.remove(classNames.overflowHidden);
  favoritesSection.classList.remove(classNames.overflowScroll);
}

function toggleOverflowBody() {
  body.classList.toggle(classNames.overflowHidden);
}

//Funciones para la visibilidad de la sección de favoritos (mobile)
function toggleShowFavorites() {
  favoritesSection.classList.toggle(classNames.hidden);
}

function hideFavoritesSection(){
  favoritesSection.classList.add(classNames.hidden);
}

//Alternar la rotación del icono del menú del header (mobile)
function toggleMenuRotation() {
  headerMenu.classList.toggle('rotate');
}

//Hacer scroll hasta el inicio al clicar en los iconos del menú del header y del final de resultados (esta última también está en versión tablet y desktop)
function scrollToTop() {
  window.scrollTo(0, 0);
}