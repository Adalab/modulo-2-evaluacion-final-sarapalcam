"use strict";

//Cosas que faltan por hacer:
///////Quitar el elemento del array de favoritos cuando hago click en la "x" de un favorito
///////Quitarle la clase de favoritos al elemento en resultados al que estoy sacando de favoritos al hacer click en la "x" de un favorito
///////Hacer eventos sobre los dos botones de reset
///////Hacer que al clickar sobre un elemento en resultados marcado como favorito, este se elimine de la lista de favoritos
///////LocalStorage de las series favoritas, que también aparezcan marcadas en la lista de resultados si aparecen en la búsqueda -> También tendrán que eliminarse del localStorage cuando las eliminemos de la lista
///////CSS
///////Extras si me da tiempo: modo noche, versión responsive (que en el móvil los favoritos estén ocultos y los podamos desplegar abriendo un menú)

///////////////////////////////////////////////Traemos los elementos que necesitamos de HTML

const input = document.querySelector(".js-input");
const searchBtn = document.querySelector(".js-search-btn");
const resetBtn = document.querySelector(".js-reset-btn");
const favSection = document.querySelector(".js-favorites-section");
const resultSection = document.querySelector(".js-result-section");
const favList = document.querySelector(".js-favorites-list");
const resultList = document.querySelector(".js-result-list");

/////////////////////////////////////////////////Creamos nuestas constantes globales

const favorites = [];

///////////////////////////////////////////////Funciones

//Pinta las portadas y títulos en la lista de resultados a través de DOM avanzado
function renderResults(animeData) {
  resultList.innerHTML = "";
  for (const data of animeData) {
    const newLiEl = document.createElement("li");
    newLiEl.id = `${data.title}`;
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

//Añade listeners a todos los iconos de elimiar de favoritos
function removeFavorites(icons) {
  for (const icon of icons) {
    icon.addEventListener("click", handleClickRemove);
  }
}

//Pinta las portadas y títulos de las series marcadas como favoritas
function renderFavorite(ev) {
  showFavorites();
  console.log(ev.currentTarget.id);
  favList.innerHTML += `<li id="${ev.currentTarget.id}">${ev.currentTarget.innerHTML} <i class="far fa-times-circle remove_favorite"></i></li>`;
  const removeIcons = document.querySelectorAll(".remove_favorite");
  removeFavorites(removeIcons);
}

//Señala las series marcadas o desmarcadas como favoritas
function highlightFavorite(ev) {
  ev.currentTarget.classList.toggle("favorite");
}

//Añade al array de favoritos las series marcadas como favoritas
function addFavorite(ev) {
  const selectedAnimeId = ev.currentTarget.id;
  const favoriteAnimeData = favorites.find((row) => row.id === selectedAnimeId);
  if (favoriteAnimeData === undefined) {
    favorites.push(ev.currentTarget);
    renderFavorite(ev);
  }
}

///////////////////////////////////////////////Funciones manejadoras de eventos

//Elimina el título y la portada de la lista de favoritos (OJO! EN EL ARRAY DE FAVORITOS SIGUE ESTANDO). Tengo que quitar el elemento del array de favoritos y quitarle la clase de favoritos al elemento en resultados
function handleClickRemove(ev) {
  console.dir(ev.currentTarget.parentNode.id);
  for (let i = 0; i < favorites.length; i++) {
    if (ev.currentTarget.parentNode.id === favorites[i].id) {
      console.log(ev.currentTarget.parentNode.id);
      console.log(favorites[i].id);
      favorites.splice(favorites[i], 1);
      ev.currentTarget.parentNode.outerHTML = "";
    } //NO FUNIONA, VER QUÉ PASA
  }
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

///////////////////////////////////////////////Eventos

searchBtn.addEventListener("click", handleClickSearch);

// Tengo que averiguar cómo eliminar un favorito al clickar en él en la lista de resultados
//   else {
//     for (let i = 0; i < favorites.length; i++) {
//       if (selectedAnimeId === favorites[i].id) {
//         favorites.splice(favorites[i], 1);
//       }
//     }
//   }

//PARA HACER LA LISTA DE FAVORITOS CON DOM AVANZADO (renderFavorite), AÚN NO TENGO CLARO QUÉ ES LO MEJOR

/* const newLiEl = document.createElement("li");
newLiEl.id = `${ev.currentTarget.childNodes[1].innerText}`;
const newImgEl = document.createElement("img");
const newParagraphEl = document.createElement("p");
const newIconEl = document.createElement("i");
if (
  ev.currentTarget.childNodes[0].currentSrc === null ||
  ev.currentTarget.childNodes[0].currentSrc === undefined
) {
  newImgEl.src = "https://via.placeholder.com/225x317/ffffff/666666/?text=TV";
} else {
  newImgEl.src = ev.currentTarget.childNodes[0].currentSrc;
}
newImgEl.style = "height: 317px; width: 225px; background-size: cover";
newImgEl.alt = `Imagen de portada de ${ev.currentTarget.childNodes[1].innerText}`;
newImgEl.title = `Imagen de portada de ${ev.currentTarget.childNodes[1].innerText}`;
const newParagraphContent = document.createTextNode(
  `${ev.currentTarget.childNodes[1].innerText}`
);
newParagraphEl.appendChild(newParagraphContent);
newIconEl.classList.add("far");
newIconEl.classList.add("fa-times-circle");
newIconEl.classList.add("remove_favorite");
newLiEl.appendChild(newImgEl);
newLiEl.appendChild(newParagraphEl);
newLiEl.appendChild(newIconEl);
favList.appendChild(newLiEl);
const removeIcons = document.querySelectorAll(".remove_favorite");
removeFavorites(removeIcons); */
