import { fruitBowl } from './fruitBowl.js';

const svg = d3.select('svg');

const makeFruit = type => ({ 
    type,
    id: Math.random()
});

let fruits = d3.range(5)
    .map(() => makeFruit('apple'));

let selectedFruit = null;

const setSelectedFruit = id => {
    selectedFruit = id;
    render();
};

const render = () => {
    fruitBowl(svg, {
        fruits,
        height: + svg.attr('height'),
        setSelectedFruit,
        selectedFruit
    });
};

render();

// Eat an apple.
setTimeout(() => {
    fruits.pop();    //remove last element in the array
    render();
}, 1000);

// Replace an apple with a lemon.
setTimeout(() => {
    fruits[2].type = 'lemon';
    render();
}, 2000);

// Eat another apple.
setTimeout(() => {
    fruits = fruits.filter((d, i) => i !== 1);    //filter elements except the second one
    render();
}, 3000);