const svg = d3.select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

const render = data => {
    const xValue = d => d.population;
    const yValue = d => d.country;

    const margin = { top: 120, right: 20, bottom: 80, left: 160 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, xValue)])
        .range([0, innerWidth]);

    const yScale = d3.scaleBand()
        .domain(data.map(yValue))
        .range([0, innerHeight])
        // add space between bars
        .padding(0.1);    // 增加柱形之间的间隔

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // add yAxis label
    // const yAxis = d3.axisLeft(yScale);
    // yAxis(g.append('g'));
    g.append('g')
        .call(d3.axisLeft(yScale))
        /* .select('.domain')
                .remove(); */
        .selectAll('.domain, .tick line')    
        // use selectAll to select more than 1 element
        // use comma ',' to seperate
        // '.tick line' use space to select speicific elements 'line' in 'tick' class
        // use inspect in browse to see the class of the elements you want to select
            .remove();

    const xAxisTickFormat = number => 
        d3.format('~s')(number)    // 去掉最后多余的0位数
            .replace('G', 'B');    // 将单位G换成B

    const xAxis = d3.axisBottom(xScale)
        // .tickFormat(d3.format('~s')); 改成下面const的写法以更方便地定制format
        .tickFormat(xAxisTickFormat)
        .tickPadding([5]) //设置label和tick之间的间距
        .tickSize(-innerHeight);

    const xAxisG = g.append('g').call(xAxis)
        .attr('transform', `translate(0, ${innerHeight})`);

    xAxisG.select('.domain').remove();

    xAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', 50)
        .attr('x', innerWidth / 2)
        .attr('fill', 'black')
        .text('population');

    g.selectAll('rect').data(data)
        .enter().append('rect')
            .attr('y', d => yScale(yValue(d)))
            .attr('width', d => xScale(xValue(d)))
            .attr('height', yScale.bandwidth());

    g.append('text')
        .attr('class', 'title')
        .attr('text-anchor', "middle")    //设置对齐中心 start, middle, end
        .attr('x', innerWidth/2)
        .attr('y', -30)
        .text('Top 10 Most Populous Countries');
};

d3.csv('data.csv').then(data => {
    // turn data type from string to number
    data.forEach(d => {
        d.population = + d.population * 1000;
    });
    render(data);
});