console.log('app is loaded')
//console.log(d3);

let colorGroup = ["#243D4C", "#FC7F3A", "#FBC953", "#A2C083", "#599B87"]

let data = [1, 2, 3, 4, 5, 6, 7];

let chart = d3.select('.chart');

let scaleX = d3.scaleLinear()
  .domain([0, d3.max(data)])
  .range([0, '75vw']);

chart
  .selectAll('div')
  .data(data)
  .enter()
  .append('div')
  .text(d => d)
  .style('width', d => scaleX(d));




