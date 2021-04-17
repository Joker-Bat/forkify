
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Like from './models/Likes';

import { elements,renderLoader,clearLoader } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';


window.e = elements;


/** Global state of the app
 * - Search Object
 * - Current Recipe Object
 * - Shopping list Object
 * - Liked Recipes
 */

const state = {};

window.s = state;
/**
 * SEARCH Controller
 */

const searchControl = async () => {
    // 1) Get query from view
    const query = searchView.getInput(); //TODO

    if (query) {
        // New Search Object and add it to state
        state.search = new Search(query);

        // Prepare UI For results
        renderLoader(elements.searchResult);
        searchView.clearResults();
        searchView.clearInput();

        try {
            // Search for recipes
            await state.search.getResults();

            // Render Results on UI
            clearLoader();
            searchView.renderResult(state.search.result);
        } catch (error) {
            alert("Something Went wrong :(");
            clearLoader();
        }
    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    searchControl();
});


elements.searchResultPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    
    if (btn) {
        const goToPage = Number(btn.dataset.goto);
        searchView.clearResults();
        searchView.renderResult(state.search.result, goToPage);
    }
});



/**
 * RECIPE Controller
 */

const controlRecipe = async () => {

    // Get id from URL
    const id = window.location.hash.replace('#','');

    if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight the selected recipe
        if (state.search) searchView.highlightSelected(id);

        // Create new Recipe object
        state.recipe = new Recipe(id);

        try {
            // Get Recipe Data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // Calculate servings and times
            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render Recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe, 
                state.likes.isLiked(id)
            );

        } catch (error) {
            alert('Error Processing Recipe');
            console.log(error);
        }
    }
}

// Event Listenrs for Recipe

['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipe));


/**
 * LIST Controller
 */

const controlList = () => {
    // Create new list if there is nothing yet
    if (!state.list) state.list = new List();

    // Add Each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
};


// Handle delete and update list item events

elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    
    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from the state
        state.list.deleteItem(id);
        // Testing
        showDeleteBtn();

        // Delete from the UI
        listView.deleteItem(id);
    } else if (e.target.matches('.shopping__count-value')) {
        const value = parseFloat(e.target.value, 10);
        state.list.updateCount(id, value);
    }
});

elements.shoppingPage.addEventListener('click', e => {
    if (e.target.closest('.shopping__delete--all')) {
        state.list.items = [];
        listView.clearItem();
        showDeleteBtn();
    }
});

elements.shopping__add.addEventListener('click', e => {
    if(e.target.closest('.shopping__add--btn')) {
        const value = elements.addValue.value;
        const unit = elements.addUnit.value;
        const name = elements.addName.value;

        if (!state.list) {
            state.list = new List();
        }

        if (value !== '' && unit !== '' && name !== '') {
            const item = state.list.addItem(value, unit, name);
            listView.renderItem(item);
            showDeleteBtn();
        }
        
        elements.addValue.value = '';
        elements.addUnit.value= '';
        elements.addName.value = '';
        
    }
});



/**
 * LIKES Controller
 */

const controlLike = () => {

    if (!state.likes) state.likes = new Like();

    const currentId = state.recipe.id;

    // User NOT yet liked the current Recipe
    if (!state.likes.isLiked(currentId)) {
        // Add likes the state
        const newLike = state.likes.addLike(
            currentId,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        // Toggle the Like Button
        likesView.toggleLikeBtn(true);

        // Add the Like to UI
        likesView.addLike(newLike);

    // User already liked the Recipe
    } else {

        // Remove likes the state
        state.likes.deleteLike(currentId);

        // Toggle the Like Button
        likesView.toggleLikeBtn(false);

        // Remove the Like from UI
        likesView.deleteLike(currentId);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore liked recipes from localStorage

window.addEventListener('load', () => {
    state.likes = new Like();
    // List
    state.list = new List();

    // Restore likes to state
    state.likes.readStorage();

    // Show deleteBtn
    showDeleteBtn();


    // Toggle icon by likes exist
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Render the existing list to likes menu
    state.likes.likes.forEach(like => {
        likesView.addLike(like);
    });

});



// Handling Recipe and List button Clicks

elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add ingredients to shopping list
        controlList();
        showDeleteBtn();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Add Recipe to Liked List
        controlLike()
    }
});



// Testing Scripts

const showDeleteBtn = () =>  {
    if (state.list.items.length > 0) {
        elements.shopping__deleteall.classList.add('show__delete--btn');
    } else {
        elements.shopping__deleteall.classList.remove('show__delete--btn');
    }
}

