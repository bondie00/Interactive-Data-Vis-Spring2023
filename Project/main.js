/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.8,
  height = window.innerHeight * 0.9

/**
 * LOAD DATA
 * Using a Promise.all([]), we can load more than one dataset at a time
 * */
 Promise.all([
  d3.json("../data/countries.geojson"),
  d3.csv("../data/islands.csv", d3.autoType),
]).then(([geojson, guam]) => {  
  
    // SPECIFY PROJECTION
  var projection = d3.geoMercator()
    .rotate([-163,0])
    .center([0,20])
    //.translate(2,2)
    //.fitSize([innerWidth,innerHeight], geojson)
  
  var pathGen = d3.geoPath(projection)

  const guamCoord = projection([144,13])

        // APPEND SVG
  const svg = d3.select("#container")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .style("background", "#009dc4")

    var zoom = d3.zoom()
      .on('zoom', handleZoom)

    const colorScale = d3.scaleOrdinal()
      .domain(['Guam', 'Northern Mariana Islands'])
      .range(['aqua', 'purple'])

const g = d3.selectAll("svg").append("g")
    
      g.selectAll("path")
       .data(geojson.features)
       .join("path")
       .attr("class", "path")
       .attr("d", pathGen)
       .attr("fill", "green")
       .attr("stroke", "black")
       .attr("stroke-width", .01)
       .filter(d => d.properties.ADMIN == "Guam" || d.properties.ADMIN == "Northern Mariana Islands")
       .attr("fill", d => colorScale(d.properties.ADMIN))
    


function handleZoom(e) {
d3.select('g')
  .attr('transform', e.transform)}

const raceScale = d3.scaleLinear()
  .domain([0, 100])
  .range([0, height/1.5])

//console.log("guamCOord", guamCoord)

let guamButton = d3
    .select('#container')
    .append('button')
    .attr('class', 'button')
    .attr("id", "guamButton")
    .style('top', guamCoord[1]+'px')
    .style('left', guamCoord[0]+'px')
    .style('visibility', 'hidden')

    // let nmButton = d3
    // .select('#container')
    // .append('button')
    // .attr('class', 'button')
    // .attr("id", "nmButton")
    // .style('top', '250px')
    // .style('left', '425px')
  
  let worldButton = d3
    .select('#container')
    .append('button')
    .text("Return to World View")
    .attr('class', 'returnButton')
    .attr("id", "returnButton")
    .style("visibility", "hidden")
    .style('top', height)
    .style('left', '5px')

    let chinaButton = d3
    .select('#container')
    .append('button')
    .text("China")
    .attr('class', 'returnButton')
    .attr("id", "chinaButton")
    .style("visibility", "hidden")
    .style('top', '200px')
    .style('left', '200px')

  const guamTitle = d3.select("svg")
    .append("text")
    .text("GUAM")
    .attr("class", "guamTitle")
    .attr("x", width/2)
    .attr("y", height/4)
    .attr("font-size", 100)
    .attr("text-anchor", "middle")
    .attr("stroke", "black")
    .attr("fill", "aqua")
    .style("visibility", "hidden")

    const stackedRace = [
      {loc:[54,100], value: 70809, percent: 46, key:"pacific_island", index: 1},
      {loc: [18.5,54], value: 54586, percent: 35.5, key: "asian", index: 2},
      {loc: [8.5,18.5], value: 15441, percent: 10, key: "two_or_more", index: 3},
      {loc: [1.7,8.5], value: 10491, percent: 6.8, key: "white", index: 4},
      {loc: [.8,1.7], value: 1340, percent: .9, key: "black", index: 5},
      {loc: [0,.8], value: 1169, percent: .8, key: "other", index: 6}
    ]

    const stackedRacePI = [
      {loc: [33,100], value: 50420, percent: 67, key:"chamorro", index: 1},
      {loc: [18.5,33], value: 10274, percent: 14.5, key:"chuukese", index: 2},
      {loc: [13.7,18.5], value: 3420, percent: 4.8, key:"race_other_pacific", index: 3},
      {loc: [10.7,13.7], value: 2149, percent: 3, key:"palauan", index: 4},
      {loc: [7.7,10.7], value: 2096, percent: 3, key:"pohnpeian", index: 5},
      {loc: [5.5,7.7], value: 1533, percent: 2.2, key:"yapese", index: 6},
      {loc: [4,5.5], value: 456, percent: 1.5, key:"kosraean", index: 7},
      {loc: [3,4], value: 180, percent: .25, key:"marshallese", index: 8},
      {loc: [2,3], value: 126, percent: .17, key:"native_hawaiian", index: 9},
      {loc: [1,2], value: 92, percent: .13, key:"guamanian", index: 10},
      {loc: [0,1], value: 63, percent: .09, key:"carolinian", index: 11}
    ]
    
    
   const barColorScale = d3.scaleOrdinal()
    .domain(["pacific-island", "asian", "two_or_more", "white", "black", "other"])
    .range(["#ef476f", "#06d6a0", "#ffd166", "#073b4c","#D26059", "#118ab2"])

  const raceBreakdownColorScale = d3.scaleLinear()
    .domain([1,11])
    .range("#481521", "#fdedf1")
  
  const PIcolorScale = d3.scaleOrdinal()
    .domain(["chamorro", "chuukese", "race_other_pacific", "palauan", "pohnpeian", "yapese", "kosraean", "marshallese", "native_hawaiian", "guamanian", "carolinian"])
    .range(["#481521", "#601c2c", "#8f2b43", "#bf3959", "#ef476f", "#f1597d", "#f47e9a", "#f47e9a", "#f9b5c5", "#fcdae2", "#fdedf1"])
    
    const raceBar = svg.selectAll(".bar")
      .data(stackedRace)
      .join("rect")
      .attr("class", "bar")
      .attr("id", d => d.key)
      .attr("x", width/8*5)
      .attr("y", d => raceScale(d.loc[0]) + height/6)
      .attr("height", d => raceScale(d.percent))
      .attr("width", 90)   
      .attr("stroke", "black")
      .attr("fill", d => barColorScale(d.key))
      //.style('visibility', 'hidden')

      tooltip = d3
    .select('#container')
    .append('div')
    .attr('class', 'tooltip')  

      raceBar.on("mouseenter", (e,d) => {
        //console.log("key", "#"+d.key)
        d3.select("#"+d.key).transition().style("stroke-width", "2").style("stroke", "yellow")
      })
  
      raceBar.on("mouseout", (e, d) => {
        d3.select("#"+d.key)
          .transition()
          .style("stroke-width", "1")
          .style("stroke", "black")
      })

    function drawTooltip(e, d) {
      tooltip
        .style('display', 'block')
        .style('top', e.pageY + 10 + 'px')
        .style('left', e.pageX + 10 + 'px')
        .html(d.key)
      }
      

      raceBar.on("click", (e,d) => {
        //console.log("d", d)

        const coverBar = svg.append('rect')
        .attr("class", "coverBar")
        .attr("x", width/8*5)
        .attr("y", raceScale(100) + height/6)
        .attr("width", 90)
        .attr("height", 0)
        .attr("fill", barColorScale(d.key))
        .transition()
        .duration(1500)
        .attr("y", raceScale(0) + height/6)
        .attr("height", raceScale(100))
    
      svg.selectAll(".barPI")
        .data(stackedRacePI)
        .join("rect")
        .attr("class", "barPI")
        .attr("id", d => d.key)
        .transition()
        .delay(1500)
       .attr("x", width/8*5)
       .attr("y", d => raceScale(d.loc[0]) + height/6)
       .attr("width", 90)
       .attr("stroke", "black")
       .attr("fill", d => PIcolorScale(d.key))
       .attr("height", 0)
       .transition()
       .duration(1000)
       .attr("height", d => raceScale(d.loc[1]-d.loc[0]))

       const PIbars = svg.selectAll(".barPI")
      
       PIbars.on("mouseover", (e,d) => {
        d3.select("#"+d.key).transition().style("stroke-width", "2").style("stroke", "yellow")

        PIbars.on("mouseout", (e, d) => {
          d3.select("#"+d.key)
            .transition()
            .style("stroke-width", "1")
            .style("stroke", "black")
        })

        PIbars.on("dblclick", (e,d) => {
          d3.selectAll(".coverBar")
            .style("visibility", "hidden")
          d3.selectAll(".barPI")
            .transition()
            .attr("height", 0)
        })

      })
      })


let guessFlag = false
      

  svg.on("click", (e) => {
    if (guessFlag === false) {
    const [mx, my] = d3.pointer(e)
    svg.append('line')
      .style("stroke", "red")
      .style("stroke-width", 1)
      .attr("x1", mx)
      .attr("y1", my)
      .attr("x2", guamCoord[0])
      .attr("y2", guamCoord[1])
      .attr("id", "guamLine") 
    svg.append('circle')
      .attr('cx', mx)
      .attr('cy', my)
      .attr('r', 5)
      .attr("fill", "red")
      .attr("id", "guessCircle")
    }
    guessFlag = true
    d3.select("#guamButton")
      .style("visibility", "visible")

  })
      
  


  let sel = d3.select("#guamButton").on('click', function(){
      sel.transition()
      .duration(1000)
      .style("opacity", 0)
    d3.select("#guamLine")
      .transition()
      .duration(1000)
      .style("opacity", 0)
    d3.select("#guessCircle")
      .transition()
      .duration(1000)
      .style("opacity", 0)
    svg.transition()
      .duration(7000)
      .call(zoom.transform, d3.zoomIdentity.translate(-85750,-53360).scale(200))
    .on("end", function() {
    d3.select("#guamButton")
      .style("visibility", "hidden")
    d3.select("#returnButton")
       .style("visibility", "visible")
    d3.select('.guamTitle')
      .style("visibility", "visible")
    d3.selectAll('.bar')
      .style("visibility", "visible")
    })
    })

    let sel2 = d3.select("#returnButton").on('click', function() {
      sel2.style("visibility", "hidden")
      d3.select('.guamTitle')
        .style("visibility", "hidden")
      svg.transition()
        .duration(7000)
        .call(zoom.transform, d3.zoomIdentity.translate(0,0).scale(1))
    .on("end", function() {
      d3.select("#guamButton")
      .style("visibility", "visible")
        .transition()
        .duration(2000)
        .style("opacity", 100)
      })
     })


     let sel3 = d3.select('#chinaButton').on('click', function() {
      svg.transition()
      .duration(7000)
        .call(zoom.transform, d3.zoomIdentity.translate(-1500,-1000).scale(5))
     })


})