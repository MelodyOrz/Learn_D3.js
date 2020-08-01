const svg = d3.select('svg');

const height = document.body.clientHeight;
const width = document.body.clientWidth;

const radius = width / 2;

const margin = { top: radius, right: 0, bottom: 0, left: radius };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;


const treeLayout = d3.cluster().size([2 * Math.PI, radius - 100]);

const zoomG = svg
    .attr('width', width)
    .attr('height', height)
    .append('g')

const g = zoomG.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

svg.call(d3.zoom().on('zoom', () => {
    zoomG.attr('transform', d3.event.transform);
}));

function map(value, fromMin, fromMax, toMin, toMax) {
    let temp = (value - fromMin) / (fromMax - fromMin);
    return temp * (toMax - toMin) + toMin;
};

d3.json('data.json')
    .then(data => {
        const root = treeLayout(d3.hierarchy(data)
            .sort((a, b) => d3.ascending(a.data.name, b.data.name)));
        const links = treeLayout(root).links();
        const linkPathGenerator = d3.linkHorizontal()
            .x(d => d.y)
            .y(d => d.x);

        g.selectAll('path').data(root.links())
            .enter().append('path')
                .attr('d', d3.linkRadial()
                    .angle(d => d.x)
                    .radius(d => d.y));

        // add nodes
        g.selectAll('circle').data(root.descendants())
            .enter().append("circle")
                .attr("transform", d => `
                    rotate(${d.x * 180 / Math.PI - 90})
                    translate(${d.y},0)
                `)
                .attr("fill", d => d.children ? "#555" : "#999")
                .attr("r", 1.5);

        // add text label
        g.selectAll('text').data(root.descendants())
            .enter().append('text')
                //.attr("dy", "0.32em")
                // map is a function map a range of numbers to another range
                .attr('font-size', d => map(+d.depth, 0, 3, 2, 0.6) + 'em')
                .attr("transform", d => `
                    rotate(${d.x * 180 / Math.PI - 90}) 
                    translate(${d.y},0) 
                    rotate(${d.x >= Math.PI ? 180 : 0})
                `)
                .attr("font-family", "sans-serif")
                // .attr("font-size", 10)
                .attr("stroke-linejoin", "round")
                .attr("stroke-width", 2)
                .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
                .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
                .text(d => d.data.data.id)
                // .text(d => d.depth)  可以用这种方式来查看d.depth的内容是什么
            .clone(true).lower()
                .attr("stroke", "white");

    });

    // useful reference: https://observablehq.com/@d3/radial-dendrogram