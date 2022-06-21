// Algorithms part

class SortingAlgo {
    constructor() {}
    sortStep(array) {}
    isSorted(array) {}
    resetSortStep() {}
    getFirstElement() {}
    getSecondElement() {}
}

class BubbleSort extends SortingAlgo {
    constructor() {
        super()
        this.resetSortStep();
    }
    isSorted(array) {
        let sorted = true;
        for (let i = 0; i < array.length - 1; i++) {
            if (array[i] > array[i+1]) {
                sorted = false;
                break;
            }
        }
        return sorted;
    }
    sortStep(array) {
        let i = this.count;
        if (array[i] > array[i + 1]) {
            let tmp = array[i];
            array[i] = array[i + 1];
            array[i + 1] = tmp;
        }
        this.count++;
        if (this.count > array.length - 1) this.resetSortStep();
    }
    resetSortStep() {
        this.count = 0;
    }
    getFirstElement() { return this.count; }
    getSecondElement() { return this.count + 1; }
}

// Reactive components part

// Main component
const app = Vue.createApp({
    data() {
        return {
            sortTrigger: 0,
            shuffleTrigger: 0,
        };
    },
    methods: {
        sort() {
            this.sortTrigger++;
        },
        shuffle() {
            this.shuffleTrigger++;
        },
    }
});

// Sort process display component
app.component('sortui', {
    props: { size: Number, sortwatch: Number, shufflewatch: Number },
    watch: { 
        sortwatch: function(nv, ov) {
            this.sort();
        },
        shufflewatch: function(nv, ov) {
            this.fillArray();
        }
    },
    data() {
        return {
            array: [],
            sorter: new BubbleSort(),
            isSorting: false,
        };
    },
    created() {
        this.fillArray();
    },
    methods: {
        fillArray() {
            // Quit if sorting is in progress
            if (this.isSorting) {
                alert("Sort is in progress");
                return;
            }
            this.array = [];
            for (let i = 0; i < this.size; i++) {
               this.array.push(this.getRndInteger(5, 150));
            }
        },
        getRndInteger(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        getColor(number) {
            // Provide different colors for previously sorted elements
            if (this.sorter.getFirstElement() == number)
                return '#FF0000';
            if (this.sorter.getSecondElement() == number)
                return '#0000FF';
            return '#000000';
        },
        async sort() {
            // Quit if sorting is in progress
            if (this.isSorting) {
                alert("Sort already in progress");
                return;
            }
            this.isSorting = true;
            while (!this.sorter.isSorted(this.array)) {
                // Make a sorting step, and wait a bit
                this.sorter.sortStep(this.array);
                await this.sleep();
            }
            this.isSorting = false;
        },
        sleep() {
            return new Promise((resolve) => setTimeout(resolve, 50));
        },
    },
    
    template: 
    `<div class="container">
        <div class="bar" v-for="(number, index) in array" :key="index" :style="{ height: number * 4 + 'px', backgroundColor: getColor(index) }">
        </div>
    </div>`
})

app.mount("#app");
