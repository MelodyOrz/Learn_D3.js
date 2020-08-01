import { colorLegend } from './colorLegend.js';

const svg = d3.select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

const render = data => {
    const xValue = d => d.timestamp;
    const yValue = d => d.temperature;
    const colorValue = d => d.city;
    
    const xAxisLabel = 'timestamp';
    const yAxisLabel = 'temperature';
    const title = 'A Week of Temperature Around the World';

    const circleRadius = 8;

    const margin = { top: 120, right: 150, bottom: 80, left: 150 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleTime()    // scaleTime for date
        //.domain([d3.min(data, xValue), d3.max(data, xValue)])
        .domain(d3.extent(data, xValue))
        .range([0, innerWidth])
        .nice();

    const yScale = d3.scaleLinear()
        .domain(d3.extent(data, yValue))
        .range([innerHeight, 0])
        .nice();

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

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
        .attr('y', - 70)
        .attr('x', - innerHeight / 2)
        .attr('transform', 'rotate(-90)')
        .attr('fill', 'black')
        .text(yAxisLabel);

    const xAxis = d3.axisBottom(xScale)
        .ticks(6)    // set ticks number
        .tickPadding(15)    // set space between 'label' and 'tick'
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

    const lineGenerator = d3.line()
        .x(d => xScale(xValue(d)))
        .y(d => yScale(yValue(d)))
        .curve(d3.curveBasis);    // turn lines into cubic basis spline 

    const lastYValue = d => 
        yValue(d.values[d.values.length - 1]);

    const nested = d3.nest()
        .key(colorValue)
        .entries(data)
        .sort((a, b) => 
            d3.descending(lastYValue(a), lastYValue(b))
        );

    colorScale.domain(nested.map(d => d.key));

    g.selectAll('.line-path').data(nested)
        .enter().append('path')
            .attr('class', 'line-path')
            .attr('d', d => lineGenerator(d.values))
            .attr('stroke', d => colorScale(d.key));
 
    g.append('text')
        .attr('class', 'title')
        .attr('text-anchor', "middle")  
        .attr('x', innerWidth/2)
        .attr('y', -30)
        .text(title);

    svg.append('g')
        .attr('transform', `translate(840, 192)`)
        .call(colorLegend, {
            colorScale,
            circleRadius: 6,
            spacing: 20,
            textOffset: 15
        });
};

d3.csv('data-canvas-sense-your-city-one-week.csv')
    .then(data => {
        // turn data type from string to number
        data.forEach(d => {
            d.temperature = + d.temperature;
            d.timestamp = new Date(d.timestamp);
        });
        render(data);
    });