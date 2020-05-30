import { fruitBowl } from './fruitBowl.js';

const svg = d3.select('svg');

const makeFruit = type => ({ type });
const fruits = d3.range(5)
    .map(() => makeFruit('apple'));

const render = () => {
    fruitBowl(svg, {
        fruits,
        height: + svg.attr('height')
    })
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
