

import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => el.classList.remove('results__link--active'));

    document.querySelector(`.results__link[href='#${id}']`).classList.add('results__link--active');
};


export const clearResults = () => {
    elements.searchResultList.innerHTML = '';
    elements.searchResultPages.innerHTML = '';
};

// type :> 'prev' or 'next'
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? (page - 1) : (page + 1)}>
        <span>Page ${type === 'prev' ? (page - 1) : (page + 1)}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;

const renderButtons = (page, numResult, resPerPage) => {
    const pages = Math.ceil(numResult / resPerPage);

    let button;

    if (page === 1 && pages > 1) {
        // Display only next button
        button = createButton(page, 'next');
    } else if (page < pages) {
        // Display both next and previous buttons
        button = `
            ${createButton(page, 'next')}
            ${createButton(page, 'prev')}
        `;
    } else if (page === pages && pages > 1) {
        // Display only previous button
        button = createButton(page, 'prev');
    }

    elements.searchResultPages.insertAdjacentHTML('afterbegin', button);
}


export const renderResult = (recipes, page = 1, resPerPage = 10) => {
    // Render results of current page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    recipes.slice(start, end).forEach(renderRecipe);

    // Render pagination buttons

    renderButtons(page, recipes.length, resPerPage);
};


const renderRecipe = recipe => {
    const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;

    elements.searchResultList.insertAdjacentHTML('beforeend', markup);
};

// Example for title reducer

/**  'Pasta with tomato and spinach'
 *  acc = 0 / acc + cur.length = 5 / newTitle = ['Pasta']
 *  acc = 5 / acc + cur.length = 9 / newTitle = ['Pasta', 'with']
 * acc = 9 / acc + cur.length = 15 / newTitle = ['Pasta', 'with', 'tomato']
 * acc = 14 / acc + cur.length = 18 / newTitle = ['Pasta', 'with', 'tomato']
 * acc = 18 / acc + cur.length = 25 / newTitle = ['Pasta', 'with', 'tomato']
 */

export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').join(',').split('-').join(',').split(',').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur)
            }
            return acc + cur.length;
        },0)

        // Return the result
        return `${newTitle.join(' ')} ...`;
    }
    return title;
}