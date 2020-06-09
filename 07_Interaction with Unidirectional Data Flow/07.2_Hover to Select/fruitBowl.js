const colorScale = d3.scaleOrdinal()
    .domain(['apple', 'lemon'])
    .range(['#c11d1d', '#eae600']);

const radiusScale = d3.scaleOrdinal()
    .domain(['apple', 'lemon'])
    .range([50, 30]);

const xPosition = (d, i) => i * 120 + 60;

export const fruitBowl = (selection, props) => {
    const { 
        fruits, 
        height, 
        setSelectedFruit, 
        selectedFruit 
    } = props;
    
    const circles = selection.selectAll('circle')
        .data(fruits, d => d.id);

    circles
        .enter().append('circle')
            .attr('cx', xPosition)
            .attr('cy', height / 2)
            .attr('r', 0)    //set original radius for the transition
        .merge(circles)
            .attr('fill', d => colorScale(d.type))
            .attr('stroke-width', 5)
            .attr('stroke', d => d.id === selectedFruit
                ? 'black'
                : 'none'
            )
            .on('mouseover', d => setSelectedFruit(d.id))
            .on('mouseout', () => setSelectedFruit(null))
        .transition().duration(1000)    //add transition
            .attr('cx', xPosition)    //add move transition
            .attr('r', d => radiusScale(d.type));

    circles
        .exit()
        .transition().duration(1000)    //add transition
            .attr('r', 0)
        .remove();
};