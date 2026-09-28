let latestResults = [];
 
const title = document.getElementById("mainTitle");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const message = document.getElementById("message");
const randomBtn = document.getElementById("randomBtn");
const results = document.getElementById("results");
 
// ---- Save the last search to localStorage ----
function saveToLocalStorage(searchTerm, data) {
  console.log("Saving to localStorage:", searchTerm, data);
  localStorage.setItem("lastQuery", searchTerm);
  localStorage.setItem("lastResults", JSON.stringify(data));
}
 
// ---- Load the last search from localStorage (runs on page load) ----
function loadFromLocalStorage() {
  const savedQuery = localStorage.getItem("lastQuery");
  const savedResults = localStorage.getItem("lastResults");
 
  console.log("Loading from localStorage:", savedQuery, savedResults);
 
  if (savedResults) {
    latestResults = JSON.parse(savedResults);
    searchInput.value = savedQuery;
    message.textContent = "Showing your last search: " + savedQuery;
    renderResults(latestResults);
  }
}
 
// ---- Render the results to the page ----
function renderResults(data) {
  results.innerHTML = "";
 
  data.forEach(function (item) {
    const show = item.show;
 
    results.innerHTML += `
      <article class="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800">
          <img
              src="${show.image ? show.image.medium : 'https://placehold.co/300x420?text=No+Image'}"
              class="w-full h-72 object-cover"
              alt="${show.name}">
 
          <div class="p-5">
              <h2 class="text-xl font-bold">${show.name}</h2>
              <p class="text-slate-400 mt-2">
                  ${show.genres.join(", ") || "Genre unavailable"}
              </p>
              <p class="text-yellow-400 mt-3">
                  Rating: ${show.rating.average ?? "N/A"}
              </p>
          </div>
      </article>
    `;
  });
}
 
// ---- Search button click ----
searchBtn.addEventListener("click", function () {
  const searchTerm = searchInput.value;
 
  if (searchTerm === "") {
    message.textContent = "Please enter a show name.";
  } else {
    message.textContent = "You searched for: " + searchTerm;
 
    fetch("https://api.tvmaze.com/search/shows?q=" + encodeURIComponent(searchTerm))
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log("Fetched data:", data);
 
        latestResults = data;
        renderResults(data);
        saveToLocalStorage(searchTerm, data);
      });
  }
});
 
// ---- Random pick button ----
randomBtn.addEventListener("click", function () {
  if (latestResults.length === 0) {
    message.textContent = "Search for some shows first.";
    return;
  }
 
  const randomNumber = Math.floor(Math.random() * latestResults.length);
  const randomShow = latestResults[randomNumber].show;
 
  message.textContent = "Random pick: " + randomShow.name;
});
 
// ---- Run on page load ----
loadFromLocalStorage();