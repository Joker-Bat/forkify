
const axios = require('axios').default;

export default class Search {
    constructor (query) {
        this.query = query;
    }

    async getResults() {
        try {
            const result = await axios(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`);
            this.result = result.data.recipes; //recipes will be stored in state {Object} in index.js
        } catch (error) {
            console.log(error);
        }
    }
    
}




