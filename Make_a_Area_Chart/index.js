const svg = d3.select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

const render = data => {
    const xValue = d => d.year;
    const yValue = d => d.population;
    
    const xAxisLabel = 'year';
    const yAxisLabel = 'population';
    const title = 'World Population';

    const circleRadius = 8;

    const margin = { top: 120, right: 30, bottom: 80, left: 150 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleTime()    // scaleTime for date
        // .domain([d3.min(data, xValue), d3.max(data, xValue)])
        .domain(d3.extent(data, xValue))
        .range([0, innerWidth])
        // .nice(); [Q]Problem to fix: un-nice -> lack of first label, nice -> add a blank row

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, yValue)])
        .range([innerHeight, 0])
        .nice();

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
        .attr('y', - 70)
        .attr('x', - innerHeight / 2)
        .attr('transform', 'rotate(-90)')
        .attr('fill', 'black')
        .text(yAxisLabel);

    const xAxis = d3.axisBottom(xScale)
        .ticks(8)    // set ticks number
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

    const areaGenerator = d3.area()
        .x(d => xScale(xValue(d)))
        .y0(innerHeight)
        .y1(d => yScale(yValue(d)))
        .curve(d3.curveBasis);    // turn lines into cubic basis spline 

    g.append('path')
        .attr('class', 'area-path')
        .attr('d', areaGenerator(data));

    g.append('text')
        .attr('class', 'title')
        .attr('text-anchor', "middle")  
        .attr('x', innerWidth/2)
        .attr('y', -30)
        .text(title);
};

d3.csv('World_Population_by_Year_2019.csv').then(data => {
    // turn data type from string to number
    data.forEach(d => {
        console.log(data);
        d.population = + d.population * 1000;
        d.year = new Date(d.year);
    });
    render(data);
});