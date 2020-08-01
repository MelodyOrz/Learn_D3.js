import { colorLegend } from './colorLegend.js';
import { sizeLegend } from './sizeLegend.js';

const svg = d3.select('svg');

const colorScale = d3.scaleOrdinal()
    .domain(['apple', 'lemon', 'lime', 'orange'])
    .range(['#c11d1d', '#eae600', 'green', 'orange']);

svg.append('g')
    .attr('transform', `translate(100, 150)`)
    .call(colorLegend, {
        colorScale,
        circleRadius: 15,
        spacing: 40,
        textOffset: 25
    });


const sizeScale = d3.scaleSqrt()
    .domain([0, 10])
    .range([0, 20]);

svg.append('g')
    .attr('transform', `translate(400, 150)`)
    .call(sizeLegend, {
        sizeScale,
        spacing: 32,
        textOffset: 10,
        numTicks: 5,
        circleFill: 'rgba(0, 0, 0, 0.5)'
    })