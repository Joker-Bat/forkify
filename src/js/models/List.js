
module.uniqid_debug = true;

import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items = [];
    }

    addItem (count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        return item;
    }

    deleteItem (id) {
        const index = this.items.findIndex(el => el.id === id);
        // [4,5,6].splice(1,1) --> returns 5 and Mutates original array [4,6]. ==> splice(startInd, noOfElem)
        // [4,5,6].slice(1,1) --> return nothing and it doesn't mutate original array. ==> slice(startInd, EndInd)
        this.items.splice(index, 1);
    }

    updateCount(id, newCount) {
        this.items.find(el => el.id === id).count = newCount;
        
    }

    clearItem () {
        while(this.items.length > 0) {
            this.items.pop();
        }
    }
}