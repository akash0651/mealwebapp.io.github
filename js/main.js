let dishes = [];
// An array to store the fetched dishes.

let cardList = document.getElementById('card-list');
// Reference to the element with the ID 'card-list'.

let dishArea = document.getElementById('dish-area');
// Reference to the element with the ID 'dish-area'.

document.getElementById('food-inp').addEventListener('change', (e) => {
    let food = e.target.value;
    // Get the value of the input field when it changes.

    getFoods(food);
    // Call the getFoods function with the entered food value.
});

function getFoods(food) {
    // Function to fetch and display the dishes based on the food search query.
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${food}`)
        // Fetch the dishes from the API based on the search query.
        .then(res => res.json())
        // Convert the response to JSON.
        .then(data => {
            dishes = [];
            // Reset the dishes array.

            data.meals.forEach(meal => dishes.push(meal));
            // Store the fetched meals in the dishes array.

            dishArea.innerHTML = '';
            // Clear the dishArea content.

            displayDishes();
            // Call the displayDishes function to show the fetched dishes.
        })
        .catch(() => {
            cardList.innerHTML = `<p class="lead text-center">Sorry !!! No recipes found. Try searching for something else</p>`
            // Display an error message if no recipes are found.
        })
}

function displayDishes() {
    // Function to display the fetched dishes.
    let output = '';
    dishes.forEach(dish => {
        output += `
            <div class="col-xl-3 col-sm-6 col-lg-4">
                <div class="food-card" style="background: url('${dish.strMealThumb}');">
                    <div class="food-card-details text-white" foodId="${dish.idMeal}">
                        <h1 class="text-center">${dish.strMeal}</h1>
                    </div>
                </div>  
            </div>  
        `
    });
    // Loop through each dish and generate HTML markup for displaying them.

    cardList.classList.remove('d-none');
    // Remove the 'd-none' class to display the card list.

    cardList.innerHTML = output;
    // Set the HTML markup for the card list.

    init();
    // Call the init function to initialize event listeners for each dish.
}

function init() {
    // Function to initialize event listeners for each dish.
    let foodItem = document.querySelectorAll('.food-card-details');
    // Get all the elements with the class 'food-card-details'.

    foodItem.forEach(item => {
        item.addEventListener('click', (e) => {
            const id = item.getAttribute("foodId");
            // Get the 'foodId' attribute of the clicked item.

            displayRecipe(id);
            // Call the displayRecipe function to show the details of the selected dish.
        })
    })
}

function displayRecipe(id) {
    // Function to display the details of a selected dish.
    cardList.classList.add('d-none');
    // Add the 'd-none' class to hide the card list.

    const selectedDish = dishes.filter(dish => dish.idMeal == id);
    // Filter the dishes array to find the selected dish based on its ID.

    const dish = selectedDish[0];
    // Get the first (and only) item in the filtered array.

    let ingredients = [];
    // An array to store the ingredients of the dish.

    for(let i=1;i<=20;i++) {
        let ingredientName = `strIngredient${i}`;
        let quantity = `strMeasure${i}`;
        // Generate the names for the ingredient and quantity properties of the dish object.

        if (dish[ingredientName]) {
            const ingredient = {
                'ingredientname': dish[ingredientName],
                'quantity': dish[quantity]
            }
            ingredients.push(ingredient);
            // Create an ingredient object and add it to the ingredients array if the ingredient name exists.
        }
    }

    let ingredientOuput = '';
    ingredients.forEach(ingredient => {
        ingredientOuput +=
            `
            <div class="ingredient lead">${ingredient.ingredientname}<span class="amount">${ingredient.quantity}</span> </div>
        `
    })
    // Generate HTML markup to display the list of ingredients.

    let output =
        `
        <div id="recipe-header" style="background: url(${dish.strMealThumb})"></div>
        <div class="row" id="recipe">
            <h1 class="display-2 text-center col-12 mb-5">${dish.strMeal}</h1>
            <hr class="mb-5">
            <div class="col-lg-4">
                <div class="ingredient-list">
                    ${ingredientOuput}
                </div>
            </div>
            <div class="col-lg-8 px-5">
                <div id="steps">
                    <h1 class="display-4">Instructions</h1>
                    <hr>
                    <p class="lead">${dish.strInstructions}</p>
                    <a href="${dish.strYoutube}" class="btn btn-outline btn-lg btn-outline-danger">Youtube link for the recipe</a>
                </div>
            </div>
        </div>  
    `
    dishArea.innerHTML = output;
    // Set the HTML markup to display the selected dish and its details.
}
