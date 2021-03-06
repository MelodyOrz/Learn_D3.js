import { loadAndProcessData } from './loadAndProcessData.js';
import { colorLegend } from './colorLegend.js';

const svg = d3.select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

const render = data => {
    const xValue = d => d.year;
    const yValue = d => d.population;
    const colorValue = d => d.name;
    
    const xAxisLabel = 'TIME';
    const yAxisLabel = 'POPULATION';
    const title = 'Population over Time by Region';

    const margin = { top: 120, right: 360, bottom: 80, left: 120 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleTime()    // scaleTime for date
        //.domain([d3.min(data, xValue), d3.max(data, xValue)])
        .domain(d3.extent(data, xValue))
        .range([0, innerWidth])
        // .nice();

    const yScale = d3.scaleLinear()
        .domain(d3.extent(data, yValue))
        .range([innerHeight, 0])
        .nice();

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const yAxisTickFormat = number => 
        d3.format('~s')(number)    // 去掉最后多余的0位数
          .replace('G', 'B');    // 将单位G换成B

    const yAxis = d3.axisLeft(yScale)
        .tickFormat(yAxisTickFormat)
        .tickPadding(15) //设置label和tick之间的间距
        .tickSize(-innerWidth);

    const yAxisG = g.append('g').call(yAxis);
    yAxisG.select('.domain').remove();

    yAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('text-anchor', "middle")  
        .attr('y', - 60)
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
        .attr('y', 60)
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
        .attr('transform', `translate(950, 162)`)
        .call(colorLegend, {
            colorScale,
            circleRadius: 6,
            spacing: 20,
            textOffset: 15
        });
};

loadAndProcessData()
    .then(render);