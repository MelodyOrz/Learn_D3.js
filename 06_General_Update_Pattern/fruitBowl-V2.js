// This is the version which adds label and shows how nest works in GUP

const colorScale = d3.scaleOrdinal()
    .domain(['apple', 'lemon'])
    .range(['#c11d1d', '#eae600']);

const radiusScale = d3.scaleOrdinal()
    .domain(['apple', 'lemon'])
    .range([50, 30]);

export const fruitBowl = (selection, props) => {
    const { fruits, height } = props;

    // Special GUP for sigular element
    const bowl = selection.selectAll('rect') 
        .data([null])    // prevent duplicated rects
        .enter().append('rect')
            .attr('y', 120)
            .attr('width', 800)
            .attr('height', 300)
            .attr('rx', 300 / 2);    //set roundness of the rect angle

    const groups = selection.selectAll('g')
        .data(fruits, d => d.id);

    const groupsEnter = groups.enter().append('g');
    
    groupsEnter
        .merge(groups)
            .attr('transform', (d, i) => 
            `translate(${i * 140 + 120}, ${height / 2})`
            )

    groups
        .exit()
        .remove();

    groupsEnter.append('circle')
        .merge(groups.select('circle')) 
    /* another way:
    groups.select('circle')
        .merge(groupsEnter.append('circle'))
    */
            .attr('fill', d => colorScale(d.type))
            .attr('r', d => radiusScale(d.type))
 
    groupsEnter.append('text')
        .merge(groups.select('text'))
            .text(d => d.type)
            .attr('y', 90); 
};

