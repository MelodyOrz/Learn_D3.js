import { loadAndProcessData, parseYear } from './loadAndProcessData.js.js.js.js';
import { colorLegend } from './colorLegend.js.js.js.js';
import { lineChart } from './lineChart.js.js.js.js';

const svg = d3.select('svg');
const lineChartG = svg.append('g');
const colorLegendG = svg.append('g');

const width = +svg.attr('width');
const height = +svg.attr('height');

let selectedYear = 2020;
let data;

const setSelectedYear = year => {
    selectedYear = year;
    render();
};

const render = () => {
    const colorValue = d => d.name;
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    const yValue = d => d.population;

    const lastYValue = d => 
        yValue(d.values[d.values.length - 1]);

    const nested = d3.nest()
        .key(colorValue)
        .entries(data)
        .sort((a, b) => 
            d3.descending(lastYValue(a), lastYValue(b))
        );

    colorScale.domain(nested.map(d => d.key));

    lineChartG.call(lineChart, {
        colorScale,
        colorValue,
        yValue,
        xValue: d => d.year,
        xAxisLabel: 'TIME',
        yAxisLabel: 'POPULATION',
        title: 'Population over Time by Region',
        circleRadius: 8,
        margin: { 
            top: 120, 
            right: 150, 
            bottom: 80, 
            left: 120 
        },
        width,
        height,
        data,
        nested,
        selectedYear,
        setSelectedYear
    });
    
    colorLegendG
        .attr('transform', `translate(840, 162)`)
        .call(colorLegend, {
            colorScale,
            circleRadius: 6,
            spacing: 20,
            textOffset: 15
        });
};

loadAndProcessData()
    .then((loadedData) => {
       data = loadedData;
       render();
    });