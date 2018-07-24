console.log('app is loaded')
//console.log(d3);

let colorGroup = ["#243D4C", "#FC7F3A", "#FBC953", "#A2C083", "#599B87"]

let data = [10, 20, 30, 40, 50, 60, 70, 80];

let dataGroup = [[10, 20], [30, 40], [50, 60], [70, 80]]

let column = ['Brazil', 'Russia', 'India', 'South Africa']

let activePage = 4;

//basic graph info
let svg_width = $('.main').width();
let svg_height = $('.main').height() * 0.9;

let margin_top = 0.3 * svg_height;
let margin_left = 0.2 * svg_width;

let chart_width = 0.60 * svg_width;
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
  .rangeRound([0, chart_height])

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
  .text(d => d)
  .attr('x', (d, i) => margin_left + scaleX(i) + scaleX.bandwidth() / 2)
  .attr('y', d => chart_height + margin_top - scaleY(d) - 10)
  .attr('text-anchor', 'middle')
  .style('pointer-events', 'none');

svg.append('g')
  .attr('transform', () => translate(margin_left, margin_top))
  .attr('class', 'y-axis')
  .attr('text-anchor', 'end')
  .call(customYAxis);

svg.selectAll('rect')
  .data(data)
  .enter()
  .append('rect')
  .attr('x', (d, i) => scaleX(i) + margin_left)
  .attr('y', d => margin_top + (chart_height - scaleY(d)))
  .attr('width', () => scaleX.bandwidth())
  .attr('height', d => scaleY(d))
  .attr('fill', colorGroup[2])
  .on('mouseover', function () {
    d3.select(this)
      .transition()
      .duration(100)
      .attr('fill', colorGroup[1]);
  })
  .on('mouseout', function () {
    d3.select(this)
      .transition()
      .duration(1000)
      .attr('fill', colorGroup[2])
  })



//axis
svg.append('g')
  .attr('transform', () => translate(margin_left, margin_top + chart_height))
  .attr('class', 'x-axis')
  .call(axisX);




d3.select('.button-update')
  .on('click', () => {

    randomData(0, 120)
    updateData();

  })


d3.select('.button-text')
  .style('pointer-events', 'none')


function randomData(min, max, num) {
  if (activePage === 1) {
    if (!num) {
      num = data.length;
    }
    data = [];
    for (let i = 0; i < num; i++) {
      data[i] = Math.floor(Math.random() * (max - min) + min)
    }
  } else if (activePage === 2) {
    if (!num) {
      num = dataGroup.length;
    }
    dataGroup = [];
    for (let i = 0; i < num; i++) {
      let currentData = [Math.floor(Math.random() * (max - min) + min), Math.floor(Math.random() * (max - min) + min)];
      dataGroup.push(currentData);
    }
    // console.log(dataGroup)
  } else if (activePage === 3) {
    if (!num) {
      num = dataStack.length;
    }

    dataStack = [];
    for (let i = 0; i < num; i++) {
      dataStack[i] = {
        import: Math.floor(Math.random() * (max - min) + min),
        export: Math.floor(Math.random() * (max - min) + min)
      }
    }

    // console.log(dataStack)

  }
}

function updateData() {
  if (activePage === 1) {
    scaleX
      .domain(d3.range(data.length))
    scaleY
      .domain([0, d3.max(data)])
    svg.selectAll('rect')
      .data(data)
      .transition()
      .delay((d, i) => i * 50)
      // .attr('x', (d, i) => scaleX(i) + margin_left)
      .attr('y', d => margin_top + (chart_height - scaleY(d)))
      .attr('height', d => scaleY(d))
    svg.selectAll('text')
      .data(data)
      .transition()
      .delay((d, i) => i * 50)
      .text(d => d)
      //   .attr('x', (d, i) => margin_left + scaleX(i) + scaleX.bandwidth() / 2)
      .attr('y', d => chart_height + margin_top - scaleY(d) - 10)
    svg.select('.y-axis')
      .transition()
      .call(customYAxis)
    svg.select('.x-axis')
      .transition()
      .call(axisX)
  } else if (activePage === 2) {
    scaleLargeX.domain(d3.range(dataGroup.length));
    scaleGroupY.domain([0, get2dArrMax(dataGroup)]);

    chartGroup.select('.y-axis')
      .transition()
      .call(myAxis(axisGroupY))

    chartGroup.select('.x-axis')
      .transition()
      .call(axisGroupX)


    chartGroup.selectAll('rect')
      .data(getNormalArray(dataGroup))
      .transition()
      .delay((d, i) => i * 50)
      .attr('y', d => chart_height - scaleGroupY(d))
      .attr('height', d => scaleGroupY(d))

    chartGroup.selectAll('text')
      .data(getNormalArray(dataGroup))
      .transition()
      .delay((d, i) => i * 50)
      .text(d => d)
      .attr('y', d => chart_height - scaleGroupY(d))

  }
  else if (activePage === 3) {
    // console.log(dataStack);
    // stack = d3.stack().keys(['import','export']);
    series = stack(dataStack);
    scaleStackY
      .domain([0, getStackMax(series)])

    //console.log(series)

    chartStack.select('.y-axis')
      .transition()
      .call(axisStackY)

    chartStack
      .selectAll('.bar-rect')
      .data(getNormalArrayFromSeries(series))
      .transition()
      //.delay((d,i)=> i*50)
      .attr('y', d => chart_height - scaleStackY(d[1]))
      .attr('height', d => scaleStackY(d[1] - d[0]))

    chartStack
      .selectAll('.bar-stack-text')
      .data(getNormalArrayFromSeries(series))
      .transition()
      .text(d => d[1] - d[0])
      .attr('y', (d) => chart_height - scaleStackY(d[1]) + 15)

    // console.log('arr',getNormalArrayFromSeries(series))


  }
}

function getNormalArrayFromSeries(series) {
  let arr = [];
  series.forEach((data) => {
    data.forEach(d => {
      arr.push(d)
    })
  })
  //console.log(arr)
  return arr;
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
    .attr('stroke-width', "1")
    .attr("stroke-dasharray", "5,5")
}



$('.nav-btn-page1').on('click', () => {
  $('.nav-btn').removeClass('active');
  $('.nav-btn-page1').addClass('active');
  $('.pages').addClass('hidden');
  $('#page1').removeClass('hidden')
  activePage = 1;

})

$('.nav-btn-page2').on('click', () => {
  $('.nav-btn').removeClass('active');
  $('.nav-btn-page2').addClass('active');
  $('.pages').addClass('hidden');
  $('#page2').removeClass('hidden')
  activePage = 2;
})

$('.nav-btn-page3').on('click', () => {
  $('.nav-btn').removeClass('active');
  $('.nav-btn-page3').addClass('active');
  $('.pages').addClass('hidden');
  $('#page3').removeClass('hidden')
  activePage = 3;
})

$('.nav-btn-page4').on('click', () => {
  $('.nav-btn').removeClass('active');
  $('.nav-btn-page4').addClass('active');
  $('.pages').addClass('hidden');
  $('#page4').removeClass('hidden')
  activePage = 4;
})


//group bar
let scaleLargeX = d3.scaleBand()
  .domain(d3.range(dataGroup.length))
  .rangeRound([0, chart_width])
  .paddingInner(0);

let scaleSmallX = d3.scaleBand()
  .domain(d3.range(dataGroup[0].length))
  .rangeRound([0, scaleLargeX.bandwidth()])
  .paddingOuter(0.3);

let scaleGroupY = d3.scaleLinear()
  .domain([0, get2dArrMax(dataGroup)])
  .rangeRound([0, chart_height]);

let chartGroup = d3.select('.chart-group')
  .attr('width', svg_width)
  .attr('height', svg_height);



let axisGroupX = d3.axisBottom(scaleLargeX)
  .tickFormat((d, i) => column[i]);
let axisGroupY = d3.axisLeft(scaleGroupY)
  .tickFormat(d => get2dArrMax(dataGroup) - d);


chartGroup.selectAll('g')
  .data(dataGroup)
  .enter().append('g')
  .attr('transform', (d, i) => 'translate(' + (margin_left + i * scaleLargeX.bandwidth()) + ', ' + margin_top + ')')
  .selectAll('rect')
  .data(d => d)
  .enter()
  .append('rect')
  .attr('x', (d, i) => scaleSmallX(i))
  .attr('y', d => chart_height - scaleGroupY(d))
  .attr('width', scaleSmallX.bandwidth())
  .attr('height', d => scaleGroupY(d))
  .attr('fill', (d, i) => colorGroup[i % 2 + 1])
  .on('mouseover', function () {
    d3.select(this)
      .transition()
      .duration(100)
      .attr('fill', (d) => colorGroup[0]);
  })
  .on('mouseout', function () {
    d3.select(this)
      .transition()
      .duration(1000)
      .attr('fill', (d, i) => colorGroup[get2dArrIndex(dataGroup, d) + 1])
  })

chartGroup.selectAll('g')
  .data(dataGroup)
  .selectAll('text')
  .data(d => d)
  .enter()
  .append('text')
  .text(d => d)
  .attr('x', (d, i) => scaleSmallX.bandwidth() / 2 + scaleSmallX(i))
  .attr('y', d => chart_height - scaleGroupY(d) - 10)
  .attr('width', scaleSmallX.bandwidth())
  .attr('height', d => scaleGroupY(d))


chartGroup.append('g')
  .attr('transform', () => translate(margin_left, margin_top + chart_height))
  .attr('class', 'x-axis')
  .call(axisGroupX);

chartGroup.append('g')
  .attr('transform', () => translate(margin_left, margin_top))
  .attr('text-anchor', 'end')
  .attr('class', 'y-axis')
  .call(myAxis(axisGroupY));

function myAxis(myAxis, g) {
  return function (g) {
    g.call(myAxis);
    g.select(".domain").remove();
    g.selectAll('.tick line')
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", chart_width)
      .attr("y2", 0)
      .attr('stroke-width', "1")
      .attr("stroke-dasharray", "5,5")
  }
}



function get2dArrMax(arr) {
  let max = -1;
  arr.forEach(data => {
    data.forEach(d => {
      if (max < d) {
        max = d;
      }
    })
  })
  return max;
}

function get2dArrIndex(arr, data) {
  let value = -1
  arr.forEach((d) => {
    //console.log(d);
    d.forEach((v, i) => {
      //console.log(data, v, i, data ===v);
      if (data === v) {
        //console.log('!!!!!!!')
        value = i;
      }
    })
  })
  return value;
}

function getNormalArray(arr) {
  let dataArr = []
  arr.forEach(d => {
    d.forEach(d => {
      dataArr.push(d);
    })
  })
  return dataArr;
}

//console.log(getNomalArray(dataGroup))


let dataStack = [
  { import: 10, export: 20 },
  { import: 30, export: 40 },
  { import: 50, export: 60 },
  { import: 70, export: 80 }
]

let stack = d3.stack().keys(['import', 'export']);
let series = stack(dataStack);


// [[[0,10],[0,30],[0,50],[0,70]],[10,40],]

//console.log(series[1])


let chartStack = d3.select('.chart-stack')
  .attr('width', svg_width)
  .attr('height', svg_height);

let scaleStackX = d3.scaleBand()
  .domain(d3.range(dataStack.length))
  .rangeRound([0, chart_width])
  .padding(0.1)

let axisStackX = d3.axisBottom(scaleStackX)
  .tickFormat((d, i) => column[i]);

chartStack
  .append('g')
  .attr('transform', translate(margin_left, chart_height + margin_top))
  .classed('x-axis', true)
  .call(axisStackX);

let scaleStackY = d3.scaleLinear()
  .domain([0, getStackMax(series)])
  .rangeRound([0, chart_height])

let axisStackY = d3.axisLeft(scaleStackY)
  .tickFormat(d => getStackMax(series) - d)

chartStack
  .append('g')
  .attr('transform', translate(margin_left, margin_top))
  .classed('y-axis', true)
  .call(axisStackY)

chartStack
  .selectAll('g.stack')
  .data(series)
  .enter()
  .append('g')
  .attr('class', 'bar-stack')
  .attr('fill', (d, i) => colorGroup[i + 1])
  .attr('transform', (d, i) => { return translate(margin_left, margin_top) })
  .selectAll('rect')
  .data(d => d)
  .enter()
  .append('rect')
  .classed('bar-rect', true)
  .attr('x', (d, i) => scaleStackX(i))
  .attr('y', (d) => chart_height - scaleStackY(d[1]))
  .attr('width', scaleStackX.bandwidth())
  .attr('height', d => scaleStackY(d[1] - d[0]))

chartStack.selectAll('.bar-stack')
  .data(series)
  .append('g')
  .selectAll('text')
  .data(d => d)
  .enter()
  .append('text')
  .text(d => d[1])
  .attr('x', (d, i) => scaleStackX(i) + scaleStackX.bandwidth() / 2)
  .attr('y', (d) => chart_height - scaleStackY(d[1]) + 15)
  .classed('bar-stack-text', true)

function getStackMax(series) {
  let max = -1;
  series.forEach((data) => {
    data.forEach(d => {
      if (max < d[1]) {
        max = d[1]
      }
    })
  })
  return max;
}

function getNomalArrayFromStack(dataStack) {
  let arr = [];
  dataStack.forEach(data => {
    for (attr in data) {
      arr.push(data[attr])
    }
  })

  return arr;
}


// let demoData = [
//   {
//     import: { year2006: 7.38, year2016: 12.91 },
//     export: { year2006: 21.74, year2016: 45.20 }
//   },
//   {
//     import: { year2006: 15.83, year2016: 17.55 },
//     export: { year2006: 36.96, year2016: 31.90 },
//   },
//   {
//     import: { year2006: 14.58, year2016: 10.28 },
//     export: { year2006: 57.70, year2016: 16.65 }
//   },
//   {
//     import: { year2006: 5.77, year2016: 4.09 },
//     export: { year2006: 12.70, year2016: 22.33 },
//   }
// ]
// let demoDataNormal = getNormalArrFromDemoData(demoData);

// function getNormalArrFromDemoData(demoData) {
//   let arr = [];
//   demoData.forEach(obj => {
//     arr.push(obj['import'].year2006);
//     arr.push(obj['import'].year2016);
//     arr.push(obj['export'].year2006);
//     arr.push(obj['export'].year2016);
//   })

//   return arr
// }



// let scaleDemoY = d3.scaleLinear()
//   .domain([0, d3.max(getNormalArrFromDemoData(demoData))])
//   .rangeRound([0, chart_height]);

// console.log(scaleDemoY(0))





// chartDemo.append('g')
//   .attr('transform', () => translate(margin_left, margin_top))
//   .attr('text-anchor', 'end')
//   .attr('class', 'y-axis')
//   .call(myAxis(axisDemoY));

// chartDemo
//   .selectAll('rect')
//   .data(demoDataNormal)
//   .enter()
//   .append('g')


// console.log(d3.stack().keys(['import','export'])(demoData))

let dataDemo = [
  {
    country: column[0],
    import: [
      { year: 2006, billions: 7.38 },
      { year: 2016, billions: 12.91 }
    ],
    export: [
      { year: 2006, billions: 21.74 },
      { year: 2016, billions: 45.20 }
    ]
  },
  {
    country: column[1],
    import: [
      { year: 2006, billions: 15.83 },
      { year: 2016, billions: 17.55 }
    ],
    export: [
      { year: 2006, billions: 36.96 },
      { year: 2016, billions: 31.90 }
    ]
  },
  {
    country: column[2],
    import: [
      { year: 2006, billions: 14.58 },
      { year: 2016, billions: 10.28 }
    ],
    export: [
      { year: 2006, billions: 57.70 },
      { year: 2016, billions: 16.65 }
    ]
  },
  {
    country: column[3],
    import: [
      { year: 2006, billions: 5.77 },
      { year: 2016, billions: 4.09 }
    ],
    export: [
      { year: 2006, billions: 12.70 },
      { year: 2016, billions: 22.33 }
    ]
  }
]

let stackDemoImport = d3.stack()
  .keys(['2006', '2016'])
  .value((d, key) => {
    switch (key) {
      case '2006':
        return d.import[0].billions;

      case '2016':
        return d.import[1].billions;
    }
  })
let stackDemoExport = d3.stack()
  .keys(['2006', '2016'])
  .value((d, key) => {
    switch (key) {
      case '2006':
        return d.export[0].billions;

      case '2016':
        return d.export[1].billions;
    }
  })

let seriesDemoImport = stackDemoImport(dataDemo);
let seriesDemoExport = stackDemoExport(dataDemo);
let seriesDemo = [seriesDemoImport[0], seriesDemoImport[1], seriesDemoExport[0], seriesDemoExport[1]]

let scaleDemoLargeX = d3.scaleBand()
  .domain(d3.range(seriesDemo.length))
  .rangeRound([0, chart_width])

let scaleDemoSmallX = d3.scaleBand()
  .domain(d3.range(2))
  .rangeRound([0, scaleDemoLargeX.bandwidth()])
  .paddingOuter(0.3)

let chartDemo = d3.select('.chart-demo')
  .attr('width', svg_width)
  .attr('height', svg_height)

let axisDemoX = d3.axisBottom(scaleDemoLargeX)

chartDemo
  .append('g')
  .attr('transform', translate(margin_left, chart_height + margin_top))
  .classed('x-axis', true)
  .call(axisStackX);

let scaleDemoY = d3.scaleLinear()
  .domain([0,getDemoMax(seriesDemo)])
  .range([0,chart_height])

let axisDemoY = d3.axisLeft(scaleDemoY)
  .tickFormat(d=>Math.floor(getDemoMax(seriesDemo)-d))

chartDemo.append('g')
  .attr('transform', () => translate(margin_left, margin_top))
  .attr('text-anchor', 'end')
  .attr('class', 'y-axis')
  .call(myAxis(axisDemoY));

chartDemo
  .selectAll('g.demo')
  .data(seriesDemo)
  .enter()
  .append('g')
  .attr('transform', (d,i)=> 'translate(' + (margin_left + i * scaleDemoLargeX.bandwidth()) + ', ' + margin_top + ')')
  .selectAll('rect')
  .data(d=>d)
  .enter()
  .append('rect')
  .attr('x',(d,i)=>{console.log(i,scaleDemoSmallX(i>=2?i-=2:i));return scaleDemoSmallX(i>=2?i-=2:i)})
  .attr('y',d => {console.log(d,d[0]);return d[0]})
  .attr('height', (d,i)=> scaleDemoY(d[1]-d[0]))
  .attr('width', scaleDemoSmallX.bandwidth())
  .attr('fill',(d,i)=>colorGroup[i%4])



function getDemoMax(seriesDemo){
  let max=-1;
  seriesDemo.forEach(d=>{
    
    d.forEach(d=>{
      if(max < d[1]) 
        max = d[1]
    })
  })

  return max
}

