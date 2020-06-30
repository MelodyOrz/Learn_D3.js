import { loadAndProcessData } from './loadAndProcessData.js';
import { colorLegend } from './colorLegend.js';

const svg = d3.select('svg');
const g = svg.append('g');

// define map projection
const projection = d3.geoNaturalEarth1();
// add geo path
const pathGenerator = d3.geoPath().projection(projection);

const colorLegendG = svg.append('g')
    .attr('transform', `translate(60, 365)`);

// select sphere area of the map, to distinguish it from the background
g.append('path')
    .attr('class', 'sphere')
    .attr('d', pathGenerator({type: 'Sphere'}));

// add panning & zooming
svg.call(d3.zoom().on('zoom', () => {
    g.attr('transform', d3.event.transform);
}));

// d3-scale-chromatic
const colorScale = d3.scaleOrdinal();
const colorValue = d => d.properties.economy;

loadAndProcessData().then(countries => {

    colorScale
        .domain(countries.features.map(colorValue))
        .domain(colorScale.domain().sort().reverse())
        .range(d3.schemeSpectral[colorScale.domain().length]);

    colorLegendG.call(colorLegend, {
        colorScale,
        circleRadius: 7,
        spacing: 18,
        textOffset: 12,
        backgroundRectWidth: 210
    });

    g.selectAll('path').data(countries.features)
        .enter().append('path')
            .attr('class', 'country')
            .attr('d', pathGenerator)
            .attr('fill', d => colorScale(colorValue(d)))
        .append('title')
            .text(d => d.properties.name + ' ' + colorValue(d));
});

