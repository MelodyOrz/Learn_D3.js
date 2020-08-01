const svg = d3.select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

// const height = document.body.clientHeight;
// const width = document.body.clientWidth;

// const margin = { top: 0, right: 0, bottom: 0, left: 0 };
// const innerWidth = width - margin.left - margin.right;
// const innerHeight = height - margin.top - margin.bottom;

// const g = svg.append("g").attr("transform", "translate(" + (width/4  - 50) + "," + (height/4 + 25) + ")");


const radius = innerWidth / 2;
const treeLayout = d3.cluster().size([2 * Math.PI, radius - 100])    // size[]第一个值决定半圆还是整圆，第二个值决定半径大小

// const zoomG = svg
//         .attr('width', width)
//         .attr('height', height)
//     .append('g')

// const g = zoomG.append('g')
//         .attr('transform', `translate(${margin.left}, ${margin.top})`);

// svg.call(d3.zoom().on('zoom', () => {
//     zoomG.attr('transform', d3.event.transform);
// }));



d3.json('data.json')
    .then(data => {
        const root = d3.hierarchy(data);
        const links = treeLayout(root).links();
        const linkPathGenerator = d3.linkRadial()
            .angle(d => d.x)
            .radius(d => d.y);

        svg.append("g")
            .selectAll("circle")
            .data(root.descendants())
            .join("circle")
              .attr("transform", d => `
                rotate(${d.x * 180 / Math.PI - 90})
                translate(${d.y},0)
              `)
              .attr("fill", d => d.children ? "#555" : "#999")
              .attr("r", 2.5);
        
        svg.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("stroke-linejoin", "round")
            .attr("stroke-width", 3)
        .selectAll("text")
        .data(root.descendants())
        .join("text")
            .attr("transform", d => `
            rotate(${d.x * 180 / Math.PI - 90}) 
            translate(${d.y},0) 
            rotate(${d.x >= Math.PI ? 180 : 0})
            `)
            .attr("dy", "0.31em")
            .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
            .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
            .text(d => d.data.data.id)
        .clone(true).lower()
            .attr("stroke", "white");
            
        return svg.attr("viewBox", autoBox).node();
    });
        

        // g.selectAll('path').data(links)
        //     .enter().append('path')
        //         .attr('d', linkPathGenerator);

        // const node = g.selectAll(".node")
        //     .data(root.descendants())
        //     .enter().append("g")
        //         //.attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
        //         .attr("transform", function(d) { return "translate(" + project(d.x, d.y) + ")"; });
        
        // node.append("circle")
        //     .attr("r", 2.5);

        // node.append("text")
        //     .attr("dy", ".31em")
        //     .attr("x", function(d) { return d.x < 180 === !d.children ? 6 : -6; })
        //     .style("text-anchor", function(d) { return d.x < 180 === !d.children ? "start" : "end"; })
        //     .attr("transform", function(d) { return "rotate(" + (d.x < 180 ? d.x - 90 : d.x + 90) + ")"; })
        //     .text(d => d.data.data.id);

        // add text label
        // g.selectAll('text').data(root.descendants())
        //     .enter().append('text')
        //         .attr("transform", d => `
        //             rotate(${d.x * 180 / Math.PI - 90}) 
        //             translate(${d.y},0) 
        //             rotate(${d.x >= Math.PI ? 0 : 0})
        //         `)        
        //         .attr('dy', '0.32em')
        //         //.attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
        //         .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
        //         .attr('font-size', d => 3.2 - d.depth + 'em')
        //         .text(d => d.data.data.id);

        // function project(x, y) {
        //     const angle = (x - 90) / 180 * Math.PI, radius = y;
        //     return [1*radius/1.9 * Math.cos(angle), 1*radius/1.9 * Math.sin(angle)];
        //     };