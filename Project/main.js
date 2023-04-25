/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.8,
  margin = { top: 20, bottom: 20, left: 20, right: 20 };

/**
 * LOAD DATA
 * Using a Promise.all([]), we can load more than one dataset at a time
 * */
 Promise.all([
  d3.json("../data/countries.geojson"),
  d3.csv("../data/usHeatExtremes.csv", d3.autoType),
]).then(([geojson, heat]) => {


  var rotate = 60
  var maxlat = 83
  
    // SPECIFY PROJECTION
    var projection = d3.geoMercator()
    .rotate([-150,0])
    .scale(150)
    .center([0,20])
    //.translate([width/2, height/2])

  //   function mercatorBounds(projection, maxlat) {
  //     var yaw = projection.rotate()[0],
  //         xymax = projection([-yaw+180-1e-6,-maxlat]),
  //         xymin = projection([-yaw-180+1e-6, maxlat]);
      
  //     return [xymin,xymax];
  // }
  
  // // set up the scale extent and initial scale for the projection
  // var b = mercatorBounds(projection, maxlat),
  //     s = width/(b[1][0]-b[0][0]),
  //     scaleExtent = [s, 10*s];
  
  // projection
  //     .scale(scaleExtent[0]);
 

    // var zoom = d3.behavior.zoom()
    //   .scaleExtent(scaleExtent)
    //   .scale(projection.scale())
    //   .translate([0,0])               // not linked directly to projection
    //   .on("zoom", redraw);
      
  var pathGen = d3.geoPath(projection)

        // APPEND SVG
  const svg = d3.select("#container")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  //.call(zoom)


  // APPEND GEOJSON PATH  
  // const map = svg.selectAll('path')
  //   .data(geojson.features)
  //   .join('path')
  //   //.attr("class", "countries")
  //   .attr("d", coords => pathGen(coords))
  //   .attr("fill", "transparent")
  //   .attr("stroke", "black")
  //   .attr("stroke-width", .5)

    var g = svg.append("g");

// load and display the World
d3.json("../data/countries.geojson").then(function(topology) {

    g.selectAll("path")
       .data(geojson.features)
       .enter().append("path")
       .attr("d", pathGen)
        .attr("fill", "transparent")
       .attr("stroke", "black")
       .attr("stroke-width", .5)

});

var zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on('zoom', function(event) {
          g.selectAll('path')
           .attr('transform', event.transform)
});

svg.call(zoom)

})