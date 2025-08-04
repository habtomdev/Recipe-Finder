// --- Elements ---
const searchBtn = document.getElementById("search-btn");
const ingredientInput = document.getElementById("ingredient-input");
const resultsContainer = document.getElementById("results-container");
const modal = document.getElementById("recipe-modal");
const modalContent = document.getElementById("modal-content");
const closeModalBtn = document.querySelector(".close-btn");

// --- Event Listeners ---
searchBtn.addEventListener("click", searchRecipes);
closeModalBtn.addEventListener("click", closeModal); // New
modal.addEventListener("click", (e) => {
    // New: Close modal if background is clicked
    if (e.target === modal) {
        closeModal();
    }
});

// --- Functions ---

async function searchRecipes() {
    const ingredient = ingredientInput.value.trim();
    if (!ingredient) {
        alert("Please enter an ingredient.");
        return;
    }

    const apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.meals) {
            displayRecipes(data.meals);
        } else {
            resultsContainer.innerHTML =
                "<p>No recipes found. Try another ingredient!</p>";
        }
    } catch (error) {
        console.error("Failed to fetch recipes:", error);
        resultsContainer.innerHTML =
            "<p>There was an error fetching recipes.</p>";
    }
}

function displayRecipes(meals) {
    resultsContainer.innerHTML = "";
    meals.forEach((meal) => {
        const recipeCard = document.createElement("div");
        recipeCard.classList.add("recipe-card");
        recipeCard.dataset.mealId = meal.idMeal;

        recipeCard.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <h3>${meal.strMeal}</h3>
        `;

        // When a card is clicked, get its details
        recipeCard.addEventListener("click", () => {
            getRecipeDetails(meal.idMeal);
        });

        resultsContainer.appendChild(recipeCard);
    });
}

// NEW: Function to fetch detailed recipe info
async function getRecipeDetails(mealId) {
    const apiUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.meals && data.meals.length > 0) {
            displayRecipeModal(data.meals[0]);
        }
    } catch (error) {
        console.error("Failed to fetch recipe details:", error);
    }
}

// NEW: Function to display the modal with recipe details
function displayRecipeModal(meal) {
    // Format ingredients and measures
    let ingredientsList = "<ul>";
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim() !== "") {
            ingredientsList += `<li>${measure} ${ingredient}</li>`;
        } else {
            break; // No more ingredients
        }
    }
    ingredientsList += "</ul>";

    // Populate the modal content
    modalContent.innerHTML = `
        <h2>${meal.strMeal}</h2>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="modal-img">
        <h3>Ingredients:</h3>
        ${ingredientsList}
        <h3>Instructions:</h3>
        <p>${meal.strInstructions}</p>
    `;

    // Show the modal
    modal.style.display = "block";
}

// NEW: Function to close the modal
function closeModal() {
    modal.style.display = "none";
}
