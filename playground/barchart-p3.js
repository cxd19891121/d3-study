console.log('app is loaded')
//console.log(d3);

let colorGroup = ["#243D4C", "#FC7F3A", "#FBC953", "#A2C083", "#599B87"]

let data = [10, 20, 30, 40, 50, 60, 70, 80];

let column = ['Brazil', 'Russia','India', 'South Africa']


//basic graph info
let svg_width = $('.main').width();
let svg_height = $('.main').height()* 0.9;

let margin_top = 0.3 * svg_height;
let margin_left = 0.2 * svg_width;

let chart_width = 0.60 * svg_width ;
let chart_height = 0.60 * svg_height;

let svg = d3.select('.chart')
  .attr('width', svg_width)
  .attr('height', svg_height)

//scale first
let scaleX = d3.scaleBand()
  .domain(d3.range(data.length))
  .rangeRound([0, chart_width])
  .padding(0.3);

// let scaleX2 = d3.scaleBand()
//   .domain(d3.range(data[0].length))
//   .rangeRound([0, scaleX(1) - scaleX(0)]);

let scaleY = d3.scaleLinear()
  .domain([0, d3.max(data)])
  .rangeRound([0,chart_height])

//axis
let axisX = d3.axisBottom(scaleX);
let axisY = d3.axisLeft(scaleY)
  .ticks(5)
  .tickFormat(d => (d3.max(data) - d));

  //draw label  
svg.selectAll('text')
.data(data)
.enter()
.append('text')
.text(d =>d)
.attr('x',(d,i)=> margin_left + scaleX(i) + scaleX.bandwidth()/2)
.attr('y', d => chart_height + margin_top - scaleY(d) - 10 )
.attr('text-anchor','middle')
.style('pointer-events','none');  

svg.append('g')
  .attr('transform', () => translate(margin_left, margin_top))
  .attr('class','y-axis')
  .attr('text-anchor','end')
  .call(customYAxis);

svg.selectAll('rect')
  .data(data)
  .enter()
  .append('rect')
  .attr('x', (d, i) => scaleX(i) + margin_left)
  .attr('y', d => margin_top+ (chart_height - scaleY(d)))
  .attr('width', () => scaleX.bandwidth())
  .attr('height', d => scaleY(d))
  .attr('fill', colorGroup[2])
  .on('mouseover', function(){
    d3.select(this)
      .transition()
      .duration(100)
      .attr('fill', colorGroup[1]);
  })
  .on('mouseout', function(){
     d3.select(this)
       .transition()
       .duration(1000)
       .attr('fill',colorGroup[2])
  })



//axis
svg.append('g')
  .attr('transform', () => translate(margin_left, margin_top + chart_height))
  .attr('class','x-axis')
  .call(axisX);




d3.select('.button')
  .on('click',()=>{
    randomData(0, 120)
    updateData();
    
  })
d3.select('.button-text')
  .style('pointer-events','none')

function randomData(min,max,num){
  if(!num){
    num = data.length ;
  }
  data = [];
  for(let i = 0 ; i < num; i ++){
    data[i]= Math.floor(Math.random() * (max - min) + min)
  }
}  

function updateData(){
  scaleX
    .domain(d3.range(data.length))

  scaleY
    .domain([0, d3.max(data)])

  svg.selectAll('rect')
  .data(data)
  .transition()
  .delay((d,i)=> i * 50) 
  .attr('x', (d, i) => scaleX(i) + margin_left)
  .attr('y', d => margin_top+ (chart_height - scaleY(d)))
  .attr('height', d => scaleY(d))

  svg.selectAll('text')
  .data(data)
  .transition()
  .delay((d,i)=> i*50)
  .text(d =>d)
  .attr('x',(d,i)=> margin_left + scaleX(i) + scaleX.bandwidth()/2)
  .attr('y', d => chart_height + margin_top - scaleY(d) - 10 )

  svg.select('.y-axis')
    .transition()
    .call(customYAxis)
    
  
  svg.select('.x-axis')
    .transition()
    .call(axisX)

}  

function translate(x, y) {
  return 'translate(' + x + ',' + y + ')';
}



function customYAxis(g) {
  g.call(axisY);
  g.select(".domain").remove();
  g.selectAll('.tick line')
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", chart_width)
    .attr("y2", 0)
    .attr('stroke-width',"1")
    .attr("stroke-dasharray", "5,5")
}