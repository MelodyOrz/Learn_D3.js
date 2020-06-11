const svg = d3.select('svg');
const g = svg.append('g');

// define map projection
const projection = d3.geoNaturalEarth1();
// add geo path
const pathGenerator = d3.geoPath().projection(projection);

// select sphere area of the map, to distinguish it from the background
g.append('path')
    .attr('class', 'sphere')
    .attr('d', pathGenerator({type: 'Sphere'}));

// add panning & zooming
svg.call(d3.zoom().on('zoom', () => {
    g.attr('transform', d3.event.transform);
}));

// loading multiple data files
Promise.all([
    d3.tsv('https://unpkg.com/world-atlas@1.1.4/world/50m.tsv'),
    d3.json('https://unpkg.com/world-atlas@1.1.4/world/50m.json')
]).then(([tsvData, topoJSONdata]) => {
    const countryName = tsvData.reduce((accumulator, d) => {
        accumulator[d.iso_n3] = d.name;
        return accumulator;
    }, {});

    /* // another way to write (same function as reduce)
    const countryName = {};
    tsvData.forEach(d => {
        countryName[d.iso_n3] = d.name;
    });
    */

    const countries = topojson.feature(topoJSONdata, topoJSONdata.objects.countries)
    g.selectAll('path').data(countries.features)
        .enter().append('path')
            .attr('class', 'country')
            .attr('d', pathGenerator)
        .append('title')
            .text(d => countryName[d.id]);
});

