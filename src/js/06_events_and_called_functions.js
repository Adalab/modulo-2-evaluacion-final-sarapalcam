'use strict';

/////////////4. Funciones manejadoras de eventos
function handleClickSearch(ev) {
  ev.preventDefault();
  fetchData();
  showResultsArrow();
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
  hideResultsArrow();
}

function handleClickResetFavs(ev) {
  ev.preventDefault();
  removeOverflow();
  removeAllFavorites();
  toggleMenuRotation();
  hideFavoritesSection();
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

/////////////5. Funciones a las que llamamos nosotras
restoreSavedFavorites();
updateStatusResetBtn();

/////////////6. Eventos
searchBtn.addEventListener('click', handleClickSearch);
resetBtn.addEventListener('click', handleClickReset);
resetFavoritesBtn.addEventListener('click', handleClickResetFavs);
headerMenu.addEventListener('click', handleClickHeader);
resultsArrow.addEventListener('click', handleClickArrow);
