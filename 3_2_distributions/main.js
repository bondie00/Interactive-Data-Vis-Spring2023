/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.8,
  margin = { top: 80, bottom: 40, left: 60, right: 20 }

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
}

/* LOAD DATA */
d3.csv("../data/nfl_offensive_stats.csv", d3.autoType).then(raw_data => {
  // + SET YOUR DATA PATH
  const qbData = raw_data
    .filter(d => (d.position === "QB") && (d.pass_rating > 0) && (d.pass_att >= 10))
  // save our data to application state
  state.data = qbData
  init()
})

/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in
function init() {
  // + SCALES
   
    
   yScale = d3.scaleLinear()
    .domain(d3.extent(state.data, d => d.team_score))
    .range([height - margin.bottom, margin.top])

    console.log("extent", d3.extent(state.data, d => d.pass_rating))

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

  xScale = d3.scaleLinear()
    .domain(d3.extent(state.data, d => d.pass_rating))
    .range([margin.left, width - margin.right])

  const xAxis = d3.axisBottom(xScale)  
    svg
      .append("g")
      .attr("class", "x-axis")
      .style("transform", `translate(0px, ${height - margin.bottom}px)`)
      .call(xAxis)

    svg
      .append("text")
      .attr("class", "xAxisLabel")
      .style("transform", `translate(${width/2 + margin.left}px, ${height - 5}px)`)
      .text("quarterback passer rating")
      .attr("fill", "black")
      .attr("text-anchor", "middle")
      .attr("font-weight", "bold")

  
    
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
      .text("points scored by team")
      .attr("fill", "black")
      .attr("text-anchor", "middle")
      .attr("font-weight", "bold")

      //title
    svg
      .append("text")
      .attr("class", "title")
      .text("How Much Effect Does the Quarterback Have on a Football Game?")
      .style("transform", `translate(${width/2}px, ${margin.top - 60}px)`)
      .attr("fill", "black")
      .attr("text-anchor", "middle")
      .attr("font-size", "21pt")
      .attr("font-weight", "bold")

    svg.append("circle").attr("cx", width - 120).attr("cy", height - 120).attr("r", 6).style("fill", "blue").attr("stroke", "black")
    svg.append("circle").attr("cx",width - 120).attr("cy",height - 100).attr("r", 6).style("fill", "red").attr("stroke", "black")
    svg.append("circle").attr("cx", width - 150).attr("cy", height - 80).attr("r", 3).attr("stroke", "black").attr("fill", "transparent")
    svg.append("circle").attr("cx", width - 138).attr("cy", height - 80).attr("r", 6).attr("stroke", "black").attr("fill", "transparent")
    svg.append("circle").attr("cx", width - 120).attr("cy", height - 80).attr("r", 9).attr("stroke", "black").attr("fill", "transparent")
    svg.append("text").attr("x", width - 105).attr("y", height - 116).text("won game").style("font-size", "14px").attr("text-anchor","left")
    svg.append("text").attr("x", width - 105).attr("y", height - 96).text("lost game").style("font-size", "14px").attr("text-anchor","left")
    svg.append("text").attr("x", width - 105).attr("y", height - 76).text("point difference").style("font-size", "14px").attr("text-anchor","left")


    


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

  filteredData = state.data
    .filter(d => state.selected === d.player)
 

  // + FILTER DATA BASED ON STATE
  



    

  const dot = svg
    .selectAll("circle.data")
    .data(filteredData, d => d.player_id)
    .join(
      // + HANDLE ENTER SELECTION
      enter => enter
    .append("circle")
      .attr("cx", d => xScale(d.pass_rating))
      .attr("cy", height - margin.bottom)
      .attr("r", 2)
      .attr("class", "data")
      .attr("fill", d => colorScale(d.win_lose))
      .attr("stroke", "black")
      .call(sel => sel
      .transition()
      .duration(1000)
      .attr("cy", d => yScale(d.team_score))
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
    .style("visibility", "hidden")  
    

    dot.on("mousemove", (e, d) => {
      drawTooltip(e,d)
    })

    dot.on("mouseout", (e) => {
      removeTooltip()
    })

}

function drawTooltip(e, d) {

  tooltip
      .style("visibility", "visible")
      .style('display', 'block')
      .style('top', e.pageY + 10 + 'px')
      .style('left', e.pageX + 10 + 'px')
      .html(function() {
        if ((d.team === d.home_team) & (d.win_lose == "win")) {
          return "<b>" + d.vis_team + " @ " + d.home_team  + " (" + d.game_date + ")</b><br>"    
          + d.home_team + " scored <b>" + d.team_score + 
          " </b>pts and won by <b>" + d.point_difference + " </b>pts<br>" + d.player + " had a <b>" + d.pass_rating + " </b>passer rating<br>from <b>" + d.pass_att + " </b>pass attempts"
        } if ((d.team === d.home_team) & (d.win_lose == "lose")) {
          return "<b>" + d.vis_team + " @ " + d.home_team  + " (" + d.game_date + ")</b><br>"    
          + d.home_team + " scored <b>" + d.team_score + 
          " </b>pts and lost by <b>" + d.point_difference + " </b>pts<br>" + d.player + " had a <b>" + d.pass_rating + " </b>passer rating<br>from <b>" + d.pass_att + " </b>pass attempts"
        } if ((d.team === d.vis_team) & (d.win_lose == "lose")) {
          return "<b>" + d.vis_team + " @ " + d.home_team  + " (" + d.game_date + ")</b><br>"    
          + d.vis_team + " scored <b>" + d.team_score + 
          " </b>pts and lost by <b>" + d.point_difference + " </b>pts<br>" + d.player + " had a <b>" + d.pass_rating + " </b>passer rating<br>from <b>" + d.pass_att + " </b>pass attempts"
        } if ((d.team === d.vis_team) & (d.win_lose == "win")) {
          return "<b>" + d.vis_team + " @ " + d.home_team  + " (" + d.game_date + ")</b><br>"    
          + d.vis_team + " scored <b>" + d.team_score + 
          " </b>pts and won by <b>" + d.point_difference + " </b>pts<br>" + d.player + " had a <b>" + d.pass_rating + " </b>passer rating<br>from <b>" + d.pass_att + " </b>pass attempts"
        } if ((d.team === d.home_team) & (d.win_lose == "tie")) {
          return "<b>" + d.vis_team + " @ " + d.home_team  + " (" + d.game_date + ")</b><br>"    
          + d.home_team + " scored <b>" + d.team_score + 
          " </b>pts and tied<br>" + d.player + " had a <b>" + d.pass_rating + " </b>passer rating<br>from <b>" + d.pass_att + " </b>pass attempts"
        } if ((d.team === d.vis_team) & (d.win_lose == "tie")) {
          return "<b>" + d.vis_team + " @ " + d.home_team  + " (" + d.game_date + ")</b><br>"    
          + d.vis_team + " scored <b>" + d.team_score + 
          " </b>pts and tied<br>" + d.player + " had a <b>" + d.pass_rating + " </b>passer rating<br>from <b>" + d.pass_att + " </b>pass attempts"
        }
      }
       
      )

}

function removeTooltip() {
  if (tooltip) tooltip.style('display', 'none')
}