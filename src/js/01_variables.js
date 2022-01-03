'use strict';

/////////////1. Elementos de HTML
const input = document.querySelector('.js-input');
const searchBtn = document.querySelector('.js-search-btn');
const resetBtn = document.querySelector('.js-reset-btn');
const favList = document.querySelector('.js-favorites-list');
const resetFavoritesBtn = document.querySelector('.js-reset-favorites-btn');
const resultList = document.querySelector('.js-result-list');
const headerMenu = document.querySelector('.js-header-menu');
const favoritesSection = document.querySelector('.js-favorites-section');
const resultsArrow = document.querySelector('.js-results-arrow');
const body = document.querySelector('.js-body');

/////////////2. Constantes globales
let favorites = [];
let results = [];

//Constantes de elementos que se repiten a lo largo del código o de strings largos para ayudar a la legibilidad y a la facilidad de realizar cambios en el futuro
const classNames = {
  hidden: 'hidden',
  liResult: 'js-li-results',
  resultsHeart: 'anime__results--list--heart',
  resultsListElement: 'anime__results--list--el',
  favorite: 'favorite',
  favoritesListElement: 'anime__favorites--list--el',
  favoritesListContainer: 'anime__favorites--list--container',
  removeFavoritesIconJs: 'js-remove-favorite',
  removeFavoritesIconCss: 'anime__favorites--list--remove',
  btnOff: 'anime__favorites--btn--off',
  btnOn: 'anime__favorites--btn--on',
  overflowScroll: 'overflow__scroll',
  overflowHidden: 'overflow__hidden',
};

const defaultImgUrl = 'https://via.placeholder.com/225x317/ffffff/666666/?text=TV';

const coverImgsStyles = {
  results: 'height: 317px; width: 225px; background-size: cover',
  favorites: 'height: 170px; width: 121px; background-size: cover',
};

const favoriteHeartSrc = './assets/images/favorite.png';

