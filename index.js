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
            isSorting: false,
        };
    },
    methods: {
        sort() {
            if (this.isSorting) {
                alert("Sort is in progress");
                return;
            }
            // Notify children component
            this.sortTrigger++;
        },
        shuffle() {
            if (this.isSorting) {
                alert("Sort is in progress");
                return;
            }
            // Notify children component
            this.shuffleTrigger++;
        },
        sortToggleState() {
            this.isSorting = !this.isSorting;
        },
    }
});

// Sort process display component
app.component('sortui', {
    props: { 
        // Number of elements in sorting display
        elemcount: { type: Number, required: true }, 
        // Max element height/value
        maxelemsize: { type: Number, required: true },
        // Min element height/value
        minelemsize: { type: Number, required: true },
        // Sort watch variable
        sortwatch: Number, 
        // Shuffle watch variable
        shufflewatch: Number 
    },
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
        };
    },
    created() {
        this.fillArray();
    },
    methods: {
        // Refill array with random values
        fillArray() {
            this.array = [];
            for (let i = 0; i < this.elemcount; i++) {
               this.array.push(this.getRndInteger(this.minelemsize, this.maxelemsize));
            }
        },
        // Generate random fixed integer in given range
        getRndInteger(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        // Provides different colors for pair of sorted elements 
        getColor(number) {
            if (this.sorter.getFirstElement() == number)
                return '#FF0000';
            if (this.sorter.getSecondElement() == number)
                return '#0000FF';
            return '#000000';
        },
        // Automatic continous sort
        async sort() {
            // Disable buttons
            this.$emit("sorttoggle");
            while (!this.sorter.isSorted(this.array)) {
                // Make a sorting step, and wait a bit
                this.sorter.sortStep(this.array);
                await this.sleep();
            }
            // Enable buttons
            this.$emit("sorttoggle");
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
