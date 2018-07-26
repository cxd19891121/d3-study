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

    switch (activePage) {
        case 1:
            if (!num) {
                num = data.length;
            }
            data = [];
            for (let i = 0; i < num; i++) {
                data[i] = Math.floor(Math.random() * (max - min) + min)
            }
            break;
        case 2:
            if (!num) {
                num = dataGroup.length;
            }
            dataGroup = [];
            for (let i = 0; i < num; i++) {
                let currentData = [Math.floor(Math.random() * (max - min) + min), Math.floor(Math.random() * (max - min) + min)];
                dataGroup.push(currentData);
            }
            break;
        case 3:
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
            break;
        case 4:
            if(!num){
                num = dataDemo.length;
            }

            for(let i = 0; i<num; i++){
                dataDemo[i] = {
                    country: column[i],
                    2006:{
                        export: Math.floor(100* (Math.random() * (max - min) + min))/100,
                        import: Math.floor(100* (Math.random() * (max - min) + min))/100,
                    },
                    2016:{
                        export: Math.floor(100* (Math.random() * (max - min) + min))/100,
                        import: Math.floor(100* (Math.random() * (max - min) + min))/100,
                    }
                }
            }
            break;
    }
}

function updateData() {

    switch (activePage) {
        case 1:
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
            break;
        case 2:
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

            break;
        case 3:
            series = stack(dataStack);
            scaleStackY
                .domain([0, getStackMax(series)])

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

            break;

        case 4:
            stackDemo2006 = d3.stack()
                .keys(['export', 'import'])
                .value((d, key) => d[2006][key]);

            stackDemo2016 = d3.stack()
                .keys(['export', 'import'])
                .value((d, key) => d[2016][key]);

            seriesDemo2006 = stackDemo2006(dataDemo);
            seriesDemo2016 = stackDemo2016(dataDemo);

            seriesDemo = [seriesDemo2006[0], seriesDemo2006[1], seriesDemo2016[0], seriesDemo2016[1]];

            finalDataDemo = [
                [seriesDemo2006[0][0], seriesDemo2016[0][0], seriesDemo2006[1][0], seriesDemo2016[1][0],],
                [seriesDemo2006[0][1], seriesDemo2016[0][1], seriesDemo2006[1][1], seriesDemo2016[1][1],],
                [seriesDemo2006[0][2], seriesDemo2016[0][2], seriesDemo2006[1][2], seriesDemo2016[1][2],],
                [seriesDemo2006[0][3], seriesDemo2016[0][3], seriesDemo2006[1][3], seriesDemo2016[1][3],],
            ];

            scaleDemoLargeX
                .domain(d3.range(seriesDemo.length))
                .rangeRound([0, chart_width])

            scaleDemoSmallX
                .domain(d3.range(2))
                .rangeRound([0, scaleDemoLargeX.bandwidth()])

            scaleDemoY
                .domain([ 0 , getDemoMax(seriesDemo)])

            chartDemo
                .select('.y-axis')
                .transition()
                .call(myAxis(axisDemoY))

            chartDemo
                .selectAll('.g-demo')
                .data(finalDataDemo)
                .selectAll('.rect-demo')
                .data(d=>d)
                .transition()
                .attr('height', (d, i) => scaleDemoY(d[1] - d[0]))
                .attr('y', d => chart_height - scaleDemoY(d[1]))

            chartDemo
                .selectAll('.g-demo')
                .data(finalDataDemo)
                .selectAll('.text-demo')
                .data(d=>d)
                .transition()
                .attr('y', d => chart_height - scaleDemoY(d[1]) + 15)
                .text(d => Math.floor(100 * (d[1] - d[0])) / 100)

            break;

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
    {import: 10, export: 20},
    {import: 30, export: 40},
    {import: 50, export: 60},
    {import: 70, export: 80}
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
    .attr('transform', (d, i) => {
        return translate(margin_left, margin_top)
    })
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

//page 4

let dataDemo = [
    {
        country: column[0],
        2006: {export: 7.38, import: 12.91},
        2016: {export: 21.74, import: 45.20}
    },
    {
        country: column[1],
        2006: {export: 15.83, import: 17.55},
        2016: {export: 36.96, import: 31.90}
    },
    {
        country: column[2],
        2006: {export: 14.58, import: 10.28},
        2016: {export: 57.70, import: 16.65}
    },
    {
        country: column[3],
        2006: {export: 5.77, import: 4.09},
        2016: {export: 12.70, import: 22.33}
    }
]


let stackDemo2006 = d3.stack()
    .keys(['export', 'import'])
    .value((d, key) => d[2006][key]);

let stackDemo2016 = d3.stack()
    .keys(['export', 'import'])
    .value((d, key) => d[2016][key]);

let seriesDemo2006 = stackDemo2006(dataDemo);
let seriesDemo2016 = stackDemo2016(dataDemo);

let seriesDemo = [seriesDemo2006[0], seriesDemo2006[1], seriesDemo2016[0], seriesDemo2016[1]];

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
    .call(axisDemoX);

let scaleDemoY = d3.scaleLinear()
    .domain([0, getDemoMax(seriesDemo)])
    .range([0, chart_height])

let axisDemoY = d3.axisLeft(scaleDemoY)
    .ticks(4)
    .tickFormat(d => Math.floor(getDemoMax(seriesDemo) - d))

chartDemo.append('g')
    .attr('transform', () => translate(margin_left, margin_top))
    .attr('text-anchor', 'end')
    .attr('class', 'y-axis')
    .call(myAxis(axisDemoY));

let finalDataDemo = [
    [seriesDemo2006[0][0], seriesDemo2016[0][0], seriesDemo2006[1][0], seriesDemo2016[1][0],],
    [seriesDemo2006[0][1], seriesDemo2016[0][1], seriesDemo2006[1][1], seriesDemo2016[1][1],],
    [seriesDemo2006[0][2], seriesDemo2016[0][2], seriesDemo2006[1][2], seriesDemo2016[1][2],],
    [seriesDemo2006[0][3], seriesDemo2016[0][3], seriesDemo2006[1][3], seriesDemo2016[1][3],],
];

chartDemo.selectAll('g.demo')
    .data(finalDataDemo)
    .enter()
    .append('g')
    .classed('g-demo', true)
    .attr('transform', (d, i) => 'translate(' + (margin_left + i * scaleDemoLargeX.bandwidth()) + ', ' + margin_top + ')')
    .selectAll('rect')
    .data(d => d)
    .enter()
    .append('rect')
    .classed('rect-demo',true)
    .attr('x', (d, i) => scaleDemoSmallX(i >= 2 ? i -= 2 : i))
    .attr('y', d => chart_height - scaleDemoY(d[1]))
    .attr('height', (d, i) => scaleDemoY(d[1] - d[0]))
    .attr('width', scaleDemoSmallX.bandwidth())
    .attr('fill', (d, i) => colorGroup[i % 4])

chartDemo.selectAll('.g-demo')
    .data(finalDataDemo)
    .selectAll('text')
    .data(d => d)
    .enter()
    .append('text')
    .classed('text-demo',true)
    .attr('x', (d, i) => scaleDemoSmallX(i >= 2 ? i -= 2 : i) + scaleDemoSmallX.bandwidth() / 2)
    .attr('y', d => chart_height - scaleDemoY(d[1]) + 15)
    .text(d => Math.floor(100 * (d[1] - d[0])) / 100)

function getDemoMax(seriesDemo) {
    let max = -1;
    seriesDemo.forEach(d => {

        d.forEach(d => {
            if (max < d[1])
                max = d[1]
        })
    })

    return max
}

