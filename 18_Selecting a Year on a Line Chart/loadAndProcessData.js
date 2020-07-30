export const parseYear = d3.timeParse('%Y');
const allCaps = str => str === str.toUpperCase();
const isRegion = name => allCaps(name) && name !== 'WORLD';

const melt = (unData, minYear, maxYear) => {

    const years = d3.range(minYear, maxYear + 1);

    const data = [];

    //  turn columns into rows
    unData.forEach(d => {
        const name  = d['Region, subregion, country or area *']
            .replace('ANG THE', '&');
        years.forEach(year  => {
            const population = + d[year].replace(/ /g, '') * 1000;
            const row = {
                year: parseYear(year),
                name,
                population
            };
            data.push(row);
        });
    });

    return data.filter(d => isRegion(d.name));
};

export const loadAndProcessData = () =>
    Promise
        .all([
            // to load this csv source need VPN if you're in China
            d3.csv('un-population-estimates-2017-medium-variant.csv'),
            d3.csv('un-population-estimates-2017.csv'),
        ])
        .then(([unDataMediumVariant, unDataEstimates]) => {
            return melt(unDataEstimates, 1950, 2014)
                .concat(melt(unDataMediumVariant, 2015, 2100));    // merge two datasets
        });

