import { parseYear } from './loadAndProcessData.js.js.js';

export const lineChart = (selection, props) => {
    const {
        colorScale,
        colorValue,
        yValue,
        xAxisLabel,
        yAxisLabel,
        title,
        circleRadius,
        margin,
        width,
        height,
        data,
        nested,
        selectedYear,
        setSelectedYear
    } = props;

    const xValue = d => d.year;

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

    const g = selection.selectAll('.container').data([null]);
    const gEnter = g.enter()
        .append('g')
            .attr('class', 'container');
    gEnter.merge(g)
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const yAxisTickFormat = number => 
        d3.format('~s')(number)    // 去掉最后多余的0位数
          .replace('G', 'B');    // 将单位G换成B

    const yAxis = d3.axisLeft(yScale)
        .tickFormat(yAxisTickFormat)
        .tickPadding(15) //设置label和tick之间的间距
        .tickSize(-innerWidth);

    const yAxisGEnter = gEnter
        .append('g')
            .attr('class', 'y-axis')
    const yAxisG = g.select('.y-axis');
    yAxisGEnter
        .merge(yAxisG)
            .call(yAxis)
            .selectAll('.domain').remove();

    yAxisGEnter
        .append('text')
            .attr('class', 'axis-label')
            .attr('text-anchor', "middle")  
            .attr('y', - 60)
            .attr('transform', 'rotate(-90)')
            .attr('fill', 'black')
        .merge(yAxisG.select('.axis-label'))
            .attr('x', - innerHeight / 2)
            .text(yAxisLabel);

    const xAxis = d3.axisBottom(xScale)
        .ticks(6)    // set ticks number
        .tickPadding(15)    // set space between 'label' and 'tick'
        .tickSize(-innerHeight);

    const xAxisGEnter = gEnter
        .append('g')
            .attr('class', 'x-axis')
    const xAxisG = g.select('.x-axis');
    xAxisGEnter
        .merge(xAxisG)
            .call(xAxis)
            .attr('transform', `translate(0, ${innerHeight})`)
            .selectAll('.domain').remove();

    xAxisGEnter
        .append('text')
            .attr('class', 'axis-label')
            .attr('y', 60)
            .attr('fill', 'black')
        .merge(xAxisG.select('.axis-label'))
            .attr('x', innerWidth / 2)
            .text(xAxisLabel);

    const lineGenerator = d3.line()
        .x(d => xScale(xValue(d)))
        .y(d => yScale(yValue(d)))
        .curve(d3.curveBasis);    // turn lines into cubic basis spline 

    // const lastYValue = d => 
    //     yValue(d.values[d.values.length - 1]);

    const linePaths = g.merge(gEnter)
        .selectAll('.line-path').data(nested);
    linePaths
        .enter().append('path')
            .attr('class', 'line-path')
        .merge(linePaths)
            .attr('d', d => lineGenerator(d.values))
            .attr('stroke', d => colorScale(d.key));

    const selectedYearDate = parseYear(selectedYear)
    gEnter
        .append('line')
            .attr('class', 'selectedYearLine')
            .attr('y1', 0)
        .merge(g.select('.selectedYearLine'))
            .attr('x1', xScale(selectedYearDate))
            .attr('x2', xScale(selectedYearDate))
            .attr('y2', innerHeight);

    gEnter
        .append('text')
            .attr('class', 'title')
            .attr('y', -30)
            .attr('text-anchor', "middle")  
        .merge(g.select('.title'))
            .attr('x', innerWidth/2)
            .text(title);

    gEnter 
        .append('rect')
            .attr('fill', 'none')
            .attr('pointer-events', 'all')
        .merge(g.select('.mouse-interceptor'))
            .attr('width', innerWidth)
            .attr('height', innerHeight)
            .on('mousemove', function() {
                const x = d3.mouse(this)[0];
                const hoveredDate = xScale.invert(x);
                setSelectedYear(hoveredDate.getFullYear());
            });
};