import { loadAndProcessData } from './loadAndProcessData.js.js';
import { sizeLegend } from './sizeLegend.js.js';

const svg = d3.select('svg');
const g = svg.append('g');

// define map projection
const projection = d3.geoNaturalEarth1();
// add geo path
const pathGenerator = d3.geoPath().projection(projection);
// to avoid exaggeration of data, use square root to map redius
const radiusValue = d => d.properties['2018'];

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

const populationFormat = d3.format(',');

loadAndProcessData().then(countries => {

    const sizeScale = d3.scaleSqrt()
        .domain([0, d3.max(countries.features, radiusValue)])
        .range([0, 26]);

    g.selectAll('path').data(countries.features)
        .enter().append('path')
            .attr('class', 'country')
            .attr('d', pathGenerator)
            .attr('fill', d => d.properties['2018'] ? '#488a2c' : '#c7afab')
        .append('title')
            .text(d => 
                isNaN(radiusValue(d))
                ? 'Missing data'
                : [ d.properties['Region, subregion, country or area *'],
                    populationFormat(radiusValue(d))
                    ].join(': ')
                );
    
    g.append('g')
       .attr('transform', `translate(50, 250)`)
       .call(sizeLegend, {
           sizeScale,
           spacing: 40,
           textOffset: 10,
           numTicks: 5,
           circleFill: 'rgba(0, 0, 0, 0.5)',
           tickFormat: populationFormat
       })
       .append('text')
            .attr('class', 'legend-title')
            .text('Population')
            .attr('y', -50)
            .attr('x', -5);

    countries.featuresWithPopulation.forEach(d => {
        d.properties.projected = projection(d3.geoCentroid(d));
        });

    g.selectAll('circle').data(countries.featuresWithPopulation)
        .enter().append('circle')
            .attr('class', 'country-circle')
            .attr('cx', d => d.properties.projected[0])
            .attr('cy', d => d.properties.projected[1])
            .attr('r', d => sizeScale(radiusValue(d)));
});

