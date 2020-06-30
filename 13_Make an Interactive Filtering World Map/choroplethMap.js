// define map projection
const projection = d3.geoNaturalEarth1();
// add geo path
const pathGenerator = d3.geoPath().projection(projection);

export const choroplethMap = (selection, props) => {
    const { 
        features,
        colorScale,
        colorValue,
        selectedColorValue
    } = props;

const gUpdate = selection.selectAll('g').data([null]);
const gEnter = gUpdate.enter().append('g');
const g = gUpdate.merge(gEnter);

// select sphere area of the map, to distinguish it from the background
gEnter
    .append('path')
        .attr('class', 'sphere')
        .attr('d', pathGenerator({type: 'Sphere'}))
    .merge(gUpdate.select('.sphere'))
        //  if colorValue has been selected, the background sphere's opacity changes
        .attr('opacity', selectedColorValue ? 0.1 : 1);

// add panning & zooming
selection.call(d3.zoom().on('zoom', () => {
    g.attr('transform', d3.event.transform);
}));

const countryPaths = g.selectAll('.country')
    .data(features);
const countryPathsEnter = countryPaths
    .enter().append('path')
        .attr('class', 'country');

countryPaths
    .merge(countryPathsEnter)
        .attr('d', pathGenerator)
        .attr('fill', d => colorScale(colorValue(d)))
        .attr('opacity', d => 
            //  if there's no selectedColorValue or selectedColorValue equals to colorValue(d)
            (!selectedColorValue || selectedColorValue === colorValue(d))
                ? 1
                : 0.2
        )
        .classed('highlighted', d => selectedColorValue && selectedColorValue === colorValue(d));
        
countryPathsEnter.append('title')
        .text(d => d.properties.name + ' ' + colorValue(d));
};