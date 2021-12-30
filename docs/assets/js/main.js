"use strict";const input=document.querySelector(".js-input"),searchBtn=document.querySelector(".js-search-btn"),resetBtn=document.querySelector(".js-reset-btn"),favList=document.querySelector(".js-favorites-list"),resetFavoritesBtn=document.querySelector(".js-reset-favorites-btn"),resultList=document.querySelector(".js-result-list"),headerMenu=document.querySelector(".js-header-menu"),favoritesSection=document.querySelector(".js-favorites-section"),resultsArrow=document.querySelector(".js-results-arrow");let favorites=[];function renderFavoriteHighliht(e){let t=[];for(const r of e)t.push(r.id);console.log(t);for(const r of favorites){const s=t.find(e=>e===r);console.log(s);for(const t of e)s===t.id&&t.classList.add("favorite")}}function renderResults(e){resultList.innerHTML="";for(const t of e){const e=document.createElement("li");e.id=""+t.mal_id,e.classList.add("js-li-results"),e.classList.add("anime__results--list--el");const r=document.createElement("img"),s=document.createElement("p");null===t.image_url||void 0===t.image_url?r.src="https://via.placeholder.com/225x317/ffffff/666666/?text=TV":r.src=t.image_url,r.style="height: 317px; width: 225px; background-size: cover",r.alt="Imagen de portada de "+t.title,r.title="Imagen de portada de "+t.title,s.classList.add("anime__results--list--title");const i=document.createTextNode(""+t.title);s.appendChild(i),e.appendChild(r),e.appendChild(s),resultList.appendChild(e),e.addEventListener("click",handleClickResultList)}renderFavoriteHighliht(document.querySelectorAll(".js-li-results"))}function getInputValue(){return input.value}function fetchResults(){const e=getInputValue();fetch("https://api.jikan.moe/v3/search/anime?q="+e).then(e=>e.json()).then(e=>{renderResults(e.results)})}function showResults(){resultList.classList.remove("hidden")}function showFavorites(){favList.classList.remove("hidden")}function highlightFavorite(e){e.currentTarget.classList.toggle("favorite")}function removeFavorites(e){for(const t of e)t.addEventListener("click",handleClickRemove)}function renderFavorite(e){showFavorites(),favList.innerHTML+=`<li class="anime__favorites--list--el" id="${e.currentTarget.id}"><div class="anime__favorites--list--container">${e.currentTarget.innerHTML}</div> <i class="fas fa-times-circle remove_favorite anime__favorites--list--remove"></i></li>`;removeFavorites(document.querySelectorAll(".remove_favorite"))}function addFavorite(e){const t=e.currentTarget.id;if(void 0===favorites.find(e=>e===t))favorites.push(e.currentTarget.id),renderFavorite(e);else{const e=favorites.findIndex(e=>e===t);favorites.splice(e,1),favList.childNodes[e].outerHTML=""}}function removeFavoriteFromArray(e){const t=favorites.findIndex(t=>t===e.currentTarget.parentNode.id),r=favorites.splice(t,1),s=resultList.childNodes;for(const e of s)e.id===r[0]&&e.classList.remove("favorite")}function removeFavoriteRender(e){e.currentTarget.parentNode.outerHTML=""}function renderFavs(){showFavorites(),favorites=JSON.parse(localStorage.getItem("favorites")),favList.innerHTML=localStorage.getItem("favorites_html");removeFavorites(document.querySelectorAll(".remove_favorite"))}function handleClickRemove(e){removeFavoriteFromArray(e),removeFavoriteRender(e),localStorage.setItem("favorites",JSON.stringify(favorites)),localStorage.setItem("favorites_html",favList.innerHTML)}function handleClickSearch(e){e.preventDefault(),fetchResults(),showResults(),resultsArrow.classList.remove("hidden")}function handleClickResultList(e){highlightFavorite(e),addFavorite(e),localStorage.setItem("favorites",JSON.stringify(favorites)),localStorage.setItem("favorites_html",favList.innerHTML)}function handleResetBtn(e){e.preventDefault(),input.value="",resultList.innerHTML="",resultsArrow.classList.add("hidden")}function handleResetFavoritesBtn(e){e.preventDefault(),headerMenu.classList.toggle("rotate"),favoritesSection.classList.add("hidden"),favList.innerHTML="",favorites=[];const t=resultList.childNodes;for(const e of t)e.classList.contains("favorite")&&e.classList.remove("favorite");localStorage.clear("favorites")}function handleClickHeader(){favoritesSection.classList.toggle("hidden"),headerMenu.classList.toggle("rotate"),window.scrollTo(0,0)}function handleScrollHeader(){window.scrollY>130?headerMenu.classList.add("black"):headerMenu.getBoundingClientRect(0,130)&&headerMenu.classList.remove("black")}function handleClickArrow(){window.scrollTo(0,0)}null!==localStorage.getItem("favorites_html")&&renderFavs(),searchBtn.addEventListener("click",handleClickSearch),resetBtn.addEventListener("click",handleResetBtn),resetFavoritesBtn.addEventListener("click",handleResetFavoritesBtn),headerMenu.addEventListener("click",handleClickHeader),document.addEventListener("scroll",handleScrollHeader),resultsArrow.addEventListener("click",handleClickArrow);