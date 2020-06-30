export const colorLegend = (selection, props) => {
    const { colorScale, circleRadius, spacing, textOffset, backgroundRectWidth, onClick, selectedColorValue } = props;

    const backgroundRect = selection.selectAll('rect')
        .data([null]);
    
    const  n = colorScale.domain().length;

    backgroundRect.enter().append('rect')
        .merge(backgroundRect)
            .attr('x', -circleRadius * 2.2)
            .attr('y', -circleRadius * 2.2)
            .attr('width', backgroundRectWidth)
            .attr('height', spacing * n + circleRadius * 2)  
            .attr('fill', 'white')
            .attr('opacity', 0.5);
    
    const groups = selection.selectAll('g')
        .data(colorScale.domain());

    const groupsEnter = groups
        .enter().append('g')
            .attr('class', 'tick');

    groupsEnter
        .merge(groups)
            .attr('transform', (d, i) => `translate(0, ${i * spacing})`)
            // set render function
            .attr('opacity', d => 
                (!selectedColorValue || d === selectedColorValue)
                    ? 1
                    : 0.2
            )
            .on('click', d => onClick(
                // double click, back to original status
                d === selectedColorValue
                    ? null
                    : d
                ));

    groups.exit().remove();
            
    groupsEnter
        .append('circle')
        .merge(groups.select('circles'))
            .attr('r', circleRadius)    
            .attr('fill', colorScale);

    groupsEnter
        .append('text')
        .merge(groups.select('text'))
            .text(d => d)
            .attr('dy', '0.32em')
            .attr('x', textOffset); 
    };

