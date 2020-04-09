const svg = d3.select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

const render = data => {
    const xValue = d => d.horsepower;
    const yValue = d => d.weight;
    //mpg,cylinders,displacement,horsepower,weight,acceleration,year,origin,name
    
    const xAxisLabel = 'horsepower';
    const yAxisLabel = 'weight';
    const title = 'Cars: Horsepower vs. Weight';

    const circleRadius = 8;

    const margin = { top: 120, right: 30, bottom: 80, left: 180 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleLinear()
        //.domain([d3.min(data, xValue), d3.max(data, xValue)])
        .domain(d3.extent(data, xValue))
        .range([0, innerWidth])
        .nice();

    const yScale = d3.scaleLinear()
        .domain(d3.extent(data, yValue))
        .range([0, innerHeight])
        .nice();

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const yAxis = d3.axisLeft(yScale)
        .tickPadding(15) //设置label和tick之间的间距
        .tickSize(-innerWidth);

    const yAxisG = g.append('g').call(yAxis);
    
    yAxisG.select('.domain').remove();

    yAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('text-anchor', "middle")  
        .attr('y', - 100)
        .attr('x', - innerHeight / 2)
        .attr('transform', 'rotate(-90)')
        .attr('fill', 'black')
        .text(yAxisLabel);

    const xAxis = d3.axisBottom(xScale)
        .tickPadding(15) //设置label和tick之间的间距
        .tickSize(-innerHeight);

    const xAxisG = g.append('g').call(xAxis)
        .attr('transform', `translate(0, ${innerHeight})`);

    xAxisG.select('.domain').remove();

    xAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', 70)
        .attr('x', innerWidth / 2)
        .attr('fill', 'black')
        .text(xAxisLabel);

    g.selectAll('circle').data(data)
        .enter().append('circle')
            .attr('cy', d => yScale(yValue(d)))
            .attr('cx', d => xScale(xValue(d)))
            .attr('r', circleRadius);

    g.append('text')
        .attr('class', 'title')
        .attr('text-anchor', "middle")  
        .attr('x', innerWidth/2)
        .attr('y', -30)
        .text(title);
};

d3.csv('auto-mpg.csv').then(data => {
    // turn data type from string to number
    data.forEach(d => {
        d.mpg = + d.mpg;
        d.cylinders = + d.cylinders;
        d.displacement = + d.displacement;
        d.horsepower = + d.horsepower;
        d.weight = + d.weight;
        d.acceleration = + d.acceleration;
        d.year = + d.year;
    });
    render(data);
});