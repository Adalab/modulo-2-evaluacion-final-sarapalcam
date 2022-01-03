'use strict';

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