const svg = d3.select('svg');

const height = + svg.attr('height');
const width = + svg.attr('width');

const g = svg.append('g')
    .attr('transform', `translate(${width / 2}, ${height / 2})`);    // use `` ${} to add variables

const face = g.append('circle')
    .attr('r', height / 2 - 10)
    .attr('fill', 'yellow')
    .attr('stroke', 'black')
    .attr('stroke-width', 3);

const eyeXSpacing = 100;
const eyeYOffset = - 70;
const eyeRadius = 30;
const eyebrowWidth = 70;
const eyebrowHeight = 15;
const eyebrowYOffset = - 60;

const eyesG = g.append('g')
    .attr('transform', `translate(0, ${eyeYOffset})`)
    .attr('fill', 'black')

const leftEye = eyesG.append('circle')
    .attr('r', eyeRadius)
    .attr('cx', -eyeXSpacing);

const rightEye = eyesG.append('circle')
    .attr('r', eyeRadius)
    .attr('cx', eyeXSpacing);

const eyebrowsG = eyesG
    .append('g')
        .attr('transform', `translate(0, ${eyebrowYOffset})`)

eyebrowsG
    .transition().duration(2000)
        .attr('transform', `translate(0, ${eyebrowYOffset - 40})`)
        .ease(d3.easeLinear)
    .transition().duration(1500)
        .attr('transform', `translate(0, ${eyebrowYOffset})`);

eyesG.transition()
    .delay(3600)
    /* .delay(function(d, i) { return i * 50; }) 另一种写法，这里的d和i是什么意思，为什么改i的值没有变化
        “When a specified transition event is dispatched on a selected node, 
        the specified listener will be invoked for the transitioning element, 
        being passed the current datum d and index i, with the this context as the current DOM element. 
        Listeners always see the latest datum for their element, 
        but the index is a property of the selection and is fixed when the listener is assigned; 
        to update the index, re-assign the listener.” ？？？
     */
    .on("start", function repeat() {
        d3.active(this)
            .style("fill", "red")
        .transition()
            .style("fill", "green")
        .transition()
            .style("fill", "blue")
        .transition()
            .on("start", repeat);    // 如何调节repeat的速度？
    });

const leftEyebrow = eyebrowsG
    .append('rect')
        .attr('x', -eyeXSpacing - eyebrowWidth / 2)
        .attr('width', eyebrowWidth)
        .attr('height', eyebrowHeight);

const rightEyebrow = eyebrowsG
    .append('rect')
        .attr('x', eyeXSpacing - eyebrowWidth / 2)
        .attr('width', eyebrowWidth)
        .attr('height', eyebrowHeight);
     /* 直接用于单个元素的transition写法：x，y
        .transition().duration(2000)
            .attr('y', eyebrowYOffset - 40)
        .transition().duration(2000)
            .attr('y', eyebrowYOffset)
     */ 

const mouth = g.append('path')
    // arc shape in d3
    .attr('d', d3.arc()({
        innerRadius: 160,
        outerRadius: 180,
        startAngle: Math.PI * 3/2,
        endAngle: Math.PI / 2
    }))
