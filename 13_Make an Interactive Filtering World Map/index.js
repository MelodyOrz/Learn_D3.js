import { loadAndProcessData } from './loadAndProcessData.js';
import { colorLegend } from './colorLegend.js';
import { choroplethMap } from './choroplethMap.js';
//  为什么每次改文件夹的名称后，此处js后面就会多一个.js??

const svg = d3.select('svg');
const g = svg.append('g');

const choroplethMapG = svg.append('g');
const colorLegendG = svg.append('g')
    .attr('transform', `translate(60, 365)`);
    
// d3-scale-chromatic
const colorScale = d3.scaleOrdinal();
const colorValue = d => d.properties.economy;

let selectedColorValue;
let features;

const onClick = d => {
    selectedColorValue = d;
    render();
};

loadAndProcessData().then(countries => {
    features = countries.features;
    render();
   });

const render = () => {
    colorScale
        .domain(features.map(colorValue))
        .domain(colorScale.domain().sort().reverse())
        .range(d3.schemeSpectral[colorScale.domain().length]);

    colorLegendG.call(colorLegend, {
        colorScale,
        circleRadius: 6,
        spacing: 18,
        textOffset: 12,
        backgroundRectWidth: 210,
        onClick,
        selectedColorValue
    });

    choroplethMapG.call(choroplethMap, {
        features,
        colorScale,
        colorValue,
        selectedColorValue
    });
};

