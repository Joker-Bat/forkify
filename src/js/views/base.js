
export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchResult: document.querySelector('.results'),
    searchResultList: document.querySelector('.results__list'),
    searchResultPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shopping: document.querySelector('.shopping__list'),
    likesList: document.querySelector('.likes__list'),
    likesIcon: document.querySelector('.likes__field'),

    // Testing
    shoppingPage: document.querySelector('.shopping'),
    shopping__add: document.querySelector('.shopping__add'),
    shopping__deleteall: document.querySelector('.shopping__delete--all'),
    addValue: document.querySelector('.shopping__add--value'),
    addUnit: document.querySelector('.shopping__add--unit'),
    addName: document.querySelector('.shopping__add--input')
};

export const elementStrings = {
    loader: 'loader',
}

export const renderLoader = parent => {
    const loader = `
        <div class="${elementStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;

    parent.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`);
    if (loader) loader.parentElement.removeChild(loader);
}