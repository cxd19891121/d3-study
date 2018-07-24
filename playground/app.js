console.log('app is loaded')
//console.log(d3);

let colorGroup =  ["#243D4C","#FC7F3A","#FBC953","#A2C083","#599B87"] 

  let p =   d3
    .select('.selection-test')

    p
        .transition()
        .style('background-color',colorGroup[0])
    p.selectAll('p')
    .data(['a','b', 'c','d','e'])
    .enter()
    .append('p')
    .text(d => d);



    // .enter()
    // .append('p')
    // .text((d,i) => {
    //     //console.log(d,i)
    //     return i + " : This is only --"+ d + "-- test!! "
    // })
    // .style('color', colorGroup[1]);


// d3
//   .selectAll("p")
//   .data([4, 8, 15, 16, 23, 42])
//   .enter().append("p")
//     .text(function(d,i) { 
//         console.log(d,i);
//         return "I’m number " + d + "!"; 
//     });

// d3
//     .selectAll('p')
//     .data([1,2,3,4,5,6,7,8,9,10])
//     .style('color',(d,i)=>{
//     console.log(d,i);
//     return colorGroup[ d%colorGroup.length];
// });
d3.selectAll('h3').style('color',colorGroup[2]);