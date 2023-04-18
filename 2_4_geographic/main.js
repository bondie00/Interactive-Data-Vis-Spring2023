/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 40 };

/**
 * LOAD DATA
 * Using a Promise.all([]), we can load more than one dataset at a time
 * */
 Promise.all([
  d3.json("../data/usState.json"),
  d3.csv("../data/usHeatExtremes.csv", d3.autoType),
]).then(([geojson, heat]) => {

  // APPEND SVG
  const svg = d3.select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)


  // SPECIFY PROJECTION
  const projection = d3.geoAlbersUsa()
    .fitSize([width, height], geojson)
 

  // DEFINE PATH FUNCTION
  const pathGen = d3.geoPath(projection)


  // APPEND GEOJSON PATH  
  const states = svg.selectAll("path.states")
    .data(geojson.features)
    .join("path")
    .attr("class", "states")
    .attr("d", coords => pathGen(coords))
    .attr("fill", "transparent")
    .attr("stroke", "black")


  const heatDown = heat.filter(d => d.Change < 0)
  const heatUp = heat.filter(d => d.Change > 0)



  const rScaleDown = d3.scaleSqrt()
      .domain([Math.abs(Math.max(...heatDown.map(d => d.Change))), Math.abs(Math.min(...heatDown.map(d => d.Change)))])
      .range([1, 7])

  const rScaleUp = d3.scaleSqrt()
    .domain([Math.min(...heatUp.map(d => d.Change)), Math.max(...heatUp.map(d => d.Change))])
    .range([1, 7])

  // APPEND DATA AS SHAPE
  const heatDownCircles = svg.selectAll("circle.heatDown")
    .data(heatDown)
    .join("circle")
    .attr("class", "heatDown")
    .attr("r", d => rScaleDown(Math.abs(d.Change)))
    .attr("fill", "deepskyblue")
    .attr("transform", (d) => {
      const [x, y] = projection([d.Long, d.Lat])
      return `translate(${x}, ${y})`
    })

  const heatUpCircles = svg.selectAll("circle.heatUp")
    .data(heatUp)
    .join("circle")
    .attr("class", "heatUp")
    .attr("r", d => rScaleUp(d.Change))
    .attr("fill", "orangered")
    .attr("transform", (d) => {
      const [x, y] = projection([d.Long, d.Lat])
      return `translate(${x}, ${y})`
    })

});