/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.8,
  margin = { top: 60, bottom: 40, left: 60, right: 20 }

// these variables allow us to access anything we manipulate in init() but need access to in draw().
// All these variables are empty before we assign something to them.
 let svg
let xScale
let yScale
let colorScale
let rScale
let tooltip

/* APPLICATION STATE */
let state = {
  data: [],
  selected: "Aaron Rodgers", // + YOUR INITIAL FILTER SELECTION
  hover: {
    name: null,
    teamPoints: null,
    passRating: null,
    gameDate: null,
  },
}

/* LOAD DATA */
d3.csv("../data/nfl_offensive_stats.csv", d3.autoType).then(raw_data => {
  // + SET YOUR DATA PATH
  console.log("data", raw_data);
  const qbData = raw_data
    .filter(d => d.position === "QB")
  // save our data to application state
  state.data = qbData
  init()
})

/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in
function init() {
  // + SCALES
   xScale = d3.scaleLinear()
    .domain(d3.extent(state.data, d => d.team_score))
    .range([margin.left, width - margin.right])
    
   yScale = d3.scaleLinear()
    .domain(d3.extent(state.data, d => d.pass_rating))
    .range([height - margin.bottom, margin.top])

   rScale = d3.scaleSqrt()
    .domain(d3.extent(state.data, d => d.point_difference))
    .range([4, 15])
    
   colorScale = d3.scaleOrdinal()
    .domain(["win", "lose", "tie"])
    .range(["blue", "red", "orange"])


  // + AXES
  svg = d3.select("#container")
    .append('svg')
    .attr("width", width)
    .attr("height", height)

  const xAxis = d3.axisBottom(xScale)  
    svg
      .append("g")
      .attr("class", "x-axis")
      .style("transform", `translate(0px, ${height - margin.bottom}px)`)
      .call(xAxis)

    svg
      .append("text")
      .attr("class", "xAxisLabel")
      .style("transform", `translate(${width/2}px, ${height - 5}px)`)
      .text("points scored by team")
      .attr("fill", "black")
      .attr("text-anchor", "middle")
    
    //y-axis
  const yAxis = d3.axisLeft(yScale)
    svg
      .append("g")
      .attr("class", "y-axis")
      .style("transform", `translate(${margin.left}px, 0px)`)
      .call(yAxis)
    
    svg
      .append("text")
      .attr("class", "yAxisLabel")
      .attr('transform', 'translate('+(margin.left - 35)+',' +height/2+ ') rotate(-90)')
      .text("quaterback passer rating")
      .attr("fill", "black")
      .attr("text-anchor", "middle")

      //title
    svg
      .append("text")
      .attr("class", "title")
      .text("NFL Quarterback performances 2019-2022")
      .style("transform", `translate(${width/2}px, ${margin.top - 20}px)`)
      .attr("fill", "black")
      .attr("text-anchor", "middle")
      .attr("font-size", "16pt")


  // + UI ELEMENT SETUP
  const allGroup = new Set(state.data.map(d => d.player))

  const selectElement = d3.select("#dropdown")
    .on('change', (event) => {
    state.selected = event.target.value
    draw()
  } )

  selectElement.selectAll("option")
    .data(allGroup)
    .join("option")
    .attr("value", d => d.player)
    .html(d => d)


   



  draw() // calls the draw function
}

/* DRAW FUNCTION */
// we call this every time there is an update to the data/state
function draw() {

  // + FILTER DATA BASED ON STATE
  const filteredData = state.data
    .filter(d => state.selected === d.player)



    

  const dot = svg
    .selectAll("circle")
    .data(filteredData, d => d.player_id)
    .join(
      // + HANDLE ENTER SELECTION
      enter => enter
    .append("circle")
      .attr("cx", d => xScale(d.team_score))
      .attr("cy", height - margin.bottom)
      .attr("r", 2)
      .attr("fill", d => colorScale(d.win_lose))
      .attr("stroke", "black")
      .call(sel => sel
      .transition()
      .duration(1000)
      .attr("cy", d => yScale(d.pass_rating))
      .attr("r", d => rScale(d.point_difference))
      ),
      // + HANDLE UPDATE SELECTION
      update => update
      ,
      // + HANDLE EXIT SELECTION
      exit => exit
      .remove()
    )

    tooltip = d3
    .select('#container')
    .append('div')
    .attr('class', 'tooltip')  
    

    dot.on("mousemove", (e, d) => {
      console.log("e", e)
      console.log("d", d)
      state.hover["name"] = d.player
      state.hover["teamPoints"] = d.team_score
      state.hover["passRating"] = d.pass_rating
      state.hover["gameDate"] = d.game_date
      console.log("hoever", state.hover)
      drawTooltip(e,d)
    })

    dot.on("mouseout", (e) => {
      removeTooltip()
    })



}

function drawTooltip(e, d) {

  let hoverData = Object.entries(state.hover)
  console.log("hoverData", hoverData)

  tooltip
      .style('display', 'block')
      .style('top', e.pageY + 10 + 'px')
      .style('left', e.pageX + 10 + 'px')
      .html(
       "<b>" + d.vis_team + " @ " + d.home_team  + " (" + d.game_date + ")</b><br>"    
        + d.team_score + 
        " pts scored<br>" + d.pass_rating + " passer rating<br>" + d.point_difference + " pt difference"
      )


  // d3.select("#hover-content")
  //   .selectAll("div.row")
  //   .data(hoverData)
  //   .join("div")
  //   .attr("class", "row")
  //   .html(
  //     d =>
  //       // each d is [key, value] pair
  //       d[1] // check if value exist
  //         ? `${d[0]}: ${d[1]}` // if they do, fill them in
  //         : null // otherwise, show nothing
  //   )

}

function removeTooltip() {
  if (tooltip) tooltip.style('display', 'none')
}