export const loadAndProcessData = () =>
    Promise
        .all([
            // to load this csv source need VPN if you're in China
            d3.csv('https://gist.githubusercontent.com/curran/e7ed69ac1528ff32cc53b70fdce16b76/raw/61f3c156efd532ae6ed84b38102cf9a0b3b1d094/data.csv'),
            d3.json('https://unpkg.com/visionscarto-world-atlas@0.0.6/world/50m.json')
        ])
        .then(([unData, topoJSONdata]) => {
            const rowById = unData.reduce((accumulator, d) => {
                accumulator[d['Country code']] = d;
                return accumulator;
        }, {});

        const countries = topojson.feature(topoJSONdata, topoJSONdata.objects.countries);

        countries.features.forEach(d => {
            Object.assign(d.properties, rowById[+d.id]);
        });

        const featuresWithPopulation = countries.features
            // filter to obtain only data with id
            .filter(d => d.properties['2018'])
            // delete all space between letters
            .map(d => {
                d.properties['2018'] = + d.properties['2018'].replace(/ /g, '') * 1000;
                return d;
            });

        return {
            features: countries.features,
            featuresWithPopulation
        };
    });