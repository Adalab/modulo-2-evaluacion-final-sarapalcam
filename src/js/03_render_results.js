'use strict';

/////////////3.2. Funciones para renderizar los resultados

//Funciones para renderizar los resultados del fetch con DOM
function setDefaultImage(url, imgElement) {
  if (url === null) {
    imgElement.src = defaultImgUrl;
  } else {
    imgElement.src = url;
  }
}

function createCoverImgResult(result) {
  const newImgResult = document.createElement('img');
  setDefaultImage(result.image_url, newImgResult);
  newImgResult.style = coverImgsStyles.results;
  newImgResult.alt = `Imagen de portada de ${result.title}`;
  newImgResult.title = `Imagen de portada de ${result.title}`;
  return newImgResult;
}

function createParagraphResult(result) {
  const newParagraphResult = document.createElement('p');
  const newParagraphResultContent = document.createTextNode(`${result.title}`);
  newParagraphResult.appendChild(newParagraphResultContent);
  return newParagraphResult;
}

function createFavoritesImgResult() {
  const newImgFavResult = document.createElement('img');
  newImgFavResult.src = favoriteHeartSrc;
  newImgFavResult.alt = 'Corazón de favorito';
  newImgFavResult.title = 'Corazón de favorito';
  newImgFavResult.classList.add(classNames.resultsHeart);
  newImgFavResult.classList.add(classNames.hidden);
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

function addClickListenerToResultLi(resultLi) {
  resultLi.addEventListener('click', handleClickListElement);
}

function createLiResult(result) {
  const newLiResult = document.createElement('li');
  newLiResult.id = `${result.mal_id}`;
  newLiResult.classList.add(classNames.liResult);
  newLiResult.classList.add(classNames.resultsListElement);
  appendElementsToResult(result, newLiResult);
  addClickListenerToResultLi(newLiResult);
  return newLiResult;
}

//Renderizar los resultados del fetch con DOM
function renderResults(results) {
  resultList.innerHTML = '';
  let newLiElement = '';
  for (const result of results) {
    newLiElement = createLiResult(result);
    resultList.appendChild(newLiElement);
  }
  showHighlitedResults();
}

//Alternar la clase de favoritos al clicar en los elemetos de resultados
function toggleFavoriteClass(ev) {
  ev.currentTarget.classList.toggle(classNames.favorite);
  ev.currentTarget.childNodes[2].classList.toggle(classNames.hidden);
}

//Funciones para mostrar u ocultar la flecha de resultados par hacer scroll-up
function showResultsArrow(){
  resultsArrow.classList.remove(classNames.hidden);

}

function hideResultsArrow(){
  resultsArrow.classList.add(classNames.hidden);
}