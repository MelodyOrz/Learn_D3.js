export const scatterPlot = (selection, props) => {
    const {
        xValue,
        yValue,
        xAxisLabel,
        yAxisLabel,    
        circleRadius,
        margin,
        width,
        height,
        data
        } = props;

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleLinear()
        // another way to write next line '.domain([d3.min(data, xValue), d3.max(data, xValue)]) '
        .domain(d3.extent(data, xValue))
        .range([0, innerWidth])
        .nice();

    const yScale = d3.scaleLinear()
        .domain(d3.extent(data, yValue))
        .range([0, innerHeight])
        .nice();

    const g = selection.selectAll('.container').data([null])
    const gEnter = g
        .enter().append('g')
            .attr('class', 'container');
    gEnter
        .merge(g)
            .attr('transform', 
                `translate(${margin.left}, ${margin.top})`
            );

    const yAxis = d3.axisLeft(yScale)
        .tickPadding(15)    // set space between 'label' and 'tick'
        .tickSize(-innerWidth);

    const yAxisG = g.select('.y-axis');
    const yAxisGEnter = gEnter
        .append('g')
            .attr('class', 'y-axis');
    yAxisG    
        .merge(yAxisGEnter)
            .call(yAxis)
            .selectAll('.domain').remove();

    const yAxisLabelText = yAxisGEnter
    yAxisLabelText
        .append('text')
            .attr('class', 'axis-label')
            .attr('text-anchor', "middle")  
            .attr('y', - 68)
            .attr('transform', 'rotate(-90)')
            .attr('fill', 'black')
        .merge(yAxisG.select('.axis-label'))
            .attr('x', - innerHeight / 2)
            .text(yAxisLabel);


    const xAxis = d3.axisBottom(xScale)
        .tickPadding(15)    // set space between 'label' and 'tick'
        .tickSize(-innerHeight);

    const xAxisG = g.select('.x-axis');
    const xAxisGEnter = gEnter
        .append('g')
            .attr('class', 'x-axis');
    xAxisG    
        .merge(xAxisGEnter)
            .attr('transform', `translate(0, ${innerHeight})`)
            .call(xAxis)
            .selectAll('.domain').remove();

    const xAxisLabelText = xAxisGEnter
        .append('text')
            .attr('class', 'axis-label')
            .attr('y', 70)
            .attr('fill', 'black')
        .merge(xAxisG.select('.axis-label'))
            .attr('x', innerWidth / 2)
            .text(xAxisLabel);

    const circles = g.merge(gEnter)
        .selectAll('circle').data(data);
    circles
        .enter().append('circle')
            //  set initial position & radius
            .attr('cx', innerWidth / 2)
            .attr('cy', innerHeight / 2)
            .attr('r', 0)
        .merge(circles)
        //  add transition after menu change
        .transition().duration(1500)
        .delay((d, i) => i * 6)
            .attr('cy', d => yScale(yValue(d)))
            .attr('cx', d => xScale(xValue(d)))
            .attr('r', circleRadius);
}