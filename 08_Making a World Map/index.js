const svg = d3.select('svg');

const projection = d3.geoNaturalEarth1();
const pathGenerator = d3.geoPath().projection(projection);

// select sphere area of the map
svg.append('path')
    .attr('class', 'sphere')
    .attr('d', pathGenerator({type: 'Sphere'}));

// use the world atlas npm made by Mike Bostock
d3.json('https://unpkg.com/world-atlas@1.1.4/world/110m.json')
    .then(data => {
        // turn TopoJSON into GeoJSON
        const countries = topojson.feature(data, data.objects.countries);

        svg.selectAll('path')
            .data(countries.features)
            .enter().append('path')
            .attr('class', 'country')
            .attr('d', pathGenerator);
    }); 