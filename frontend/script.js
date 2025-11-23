// script.js (frontend)
const searchButton = document.getElementById("search-btn");
const ingredientInput = document.getElementById("ingredient-input");
const resultsContainer = document.getElementById("recipe-results");

// Ganti dengan URL backend yang akan kamu dapatkan setelah deploy (Render URL)
const API_BASE = "https://<YOUR_BACKEND_SERVICE>.onrender.com";

searchButton.addEventListener("click", findRecipes);

async function findRecipes() {
  const userInput = ingredientInput.value;
  if (userInput.trim() === "") {
    resultsContainer.innerHTML = "<p>Jangan kosong dong, masukkan bahan dulu!</p>";
    return;
  }

  const userIngredients = userInput.split(',')
    .map(item => item.trim().toLowerCase())
    .filter(item => item.length > 0);

  resultsContainer.innerHTML = "<p>Mencari resep...</p>";

  try {
    const q = encodeURIComponent(userIngredients.join(','));
    const res = await fetch(`${API_BASE}/recipes?ingredients=${q}`);
    if (!res.ok) throw new Error('Gagal mengambil resep');

    const recipes = await res.json();
    displayRecipes(recipes);
  } catch (err) {
    console.error(err);
    resultsContainer.innerHTML = "<p>Gagal terhubung ke server. Coba lagi nanti.</p>";
  }
}

function displayRecipes(recipes) {
  resultsContainer.innerHTML = "";

  if (!recipes || recipes.length === 0) {
    resultsContainer.innerHTML = "<p>Yah, nggak nemu resep yang cocok. Coba bahan lain!</p>";
    return;
  }

  recipes.forEach(recipe => {
    const recipeCard = `
      <div class="recipe-card">
        <img src="${recipe.image || 'assets/placeholder.png'}" alt="${recipe.name}">
        <div class="recipe-content">
          <h3>${recipe.name}</h3>
          <p><strong>Bahan yang Dibutuhkan:</strong><br> ${recipe.ingredients.join(', ')}</p>
          <p><strong>Cara Membuat:</strong><br> ${recipe.instructions}</p>
        </div>
      </div>
    `;
    resultsContainer.innerHTML += recipeCard;
  });
}
