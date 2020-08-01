import { dropdownMenu } from './dropdownMenu.js.js.js';
import { scatterPlot } from './scatterPlot.js.js.js';

const svg = d3.select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

let data;
let xColumn;
let yColumn;

const onXColumnClicked = column => {
    xColumn = column;
    render();
};

const onYColumnClicked = column => {
    yColumn = column;
    render();
};

const render = () => {

    //  add menu
    d3.select('#x-menus')
        .call(dropdownMenu, {
            options: data.columns,
            onOptionClicked: onXColumnClicked,
            selectedOption: xColumn
        });

    /*
    Another way to write:

    dropdownMenu(
        d3.select('#menus'), {
            options: ['A', 'B', 'C']
    });
    */

   d3.select('#y-menus')
        .call(dropdownMenu, {
            options: data.columns,
            onOptionClicked: onYColumnClicked,
            selectedOption: yColumn
        });

    svg.call(scatterPlot, {
        xValue: d => d[xColumn],
        yValue: d => d[yColumn],        
        xAxisLabel: xColumn,
        yAxisLabel: yColumn,
        circleRadius: 8,
        margin: { top: 30, right: 40, bottom: 90, left: 140 },
        width,
        height,
        data
    });
};

d3.csv('auto-mpg.csv').then(loadedData => {
    data = loadedData;
    // turn data type from string to number
    data.forEach(d => {
        d.mpg = + d.mpg;
        d.cylinders = + d.cylinders;
        d.displacement = + d.displacement;
        d.horsepower = + d.horsepower;
        d.weight = + d.weight;
        d.acceleration = + d.acceleration;
        d.year = + d.year;
    });   
    xColumn = data.columns[4];
    yColumn = data.columns[0];
    render();
});
