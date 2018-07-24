console.log('app is loaded')
//console.log(d3);

let colorGroup = ["#243D4C", "#FC7F3A", "#FBC953", "#A2C083", "#599B87"]

let data = [1, 2, 3, 4, 5, 6, 7];

let width = 420,
  barHeight = 20;

let scaleX = d3.scaleLinear()
  .domain([0, d3.max(data)])
  .range([0, width]);

let chart = d3.select('.chart')
  .attr('width', width)
  .attr('height', barHeight * data.length);

let bar = chart.selectAll('g')
  .data(data)
  .enter().append('g')
  .attr('transform', (d, i) => 'translate(0,' + ( + i * barHeight) + ')');

bar.append('rect')
  .attr('width', d => scaleX(d))
  .attr('height', barHeight-2)

bar.append('text')
  .attr('x', d => scaleX(d) - 3)
  .attr('y', barHeight / 2)
  .text(d => d);

