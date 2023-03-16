/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.8,
  margin = { top: 60, bottom: 40, left: 60, right: 20 }
  //radius = ;

/* LOAD DATA */
d3.csv("../data/cowboys_cleaned.csv", d3.autoType)
  .then(data => {

    const svg = d3.select("#container")
      .append('svg')
      .attr("width", width)
      .attr("height", height)
      
    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.cowboys_score))
      .range([margin.left, width - margin.right])
    
    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.pass_rating))
      .range([height - margin.bottom, margin.top])

    const rScale = d3.scaleSqrt()
      .domain(d3.extent(data, d => d.point_difference))
      .range([4, 15])
    
     const colorScale = d3.scaleOrdinal()
       .domain(["win", "lose"])
       .range(["blue", "red"])
    
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
      .text("Points scored by Cowboys")
      .attr("fill", "black")
      .attr("text-anchor", "middle")
    
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
        .text("Quaterback passer rating")
        .attr("fill", "black")
        .attr("text-anchor", "middle")
        
      svg
        .append("text")
        .attr("class", "title")
        .text("Dallas Cowboys' team performance by QB performance")
        .style("transform", `translate(${width/2}px, ${margin.top - 20}px)`)
        .attr("fill", "black")
        .attr("text-anchor", "middle")
        .attr("font-size", "18pt")
      
      svg
        .append("text")
        .attr("class", "key")
        .text("blue = game won")
        .style("transform", `translate(${width - margin.right - 140}px, ${height - margin.bottom - 90}px)`)
        .attr("fill", "black")
        .attr("text-anchor", "start")
        .attr("font-size", "10pt")
        svg
        .append("text")
        .attr("class", "key")
        .text("red = game lost")
        .style("transform", `translate(${width - margin.right - 140}px, ${height - margin.bottom - 75}px)`)
        .attr("fill", "black")
        .attr("text-anchor", "start")
        .attr("font-size", "10pt")
        svg
        .append("text")
        .attr("class", "key")
        .text("dot size = win/loss margin")
        .style("transform", `translate(${width - margin.right - 140}px, ${height - margin.bottom - 60}px)`)
        .attr("fill", "black")
        .attr("text-anchor", "start")
        .attr("font-size", "10pt")
    
    const dots = svg 
      .selectAll("circle.dataPoint")
      .data(data)
      .join("circle")
      .attr("class", "dataPoint")
      .style("transform", d => `translate(${xScale(d.cowboys_score)}px, ${yScale(d.pass_rating)}px)`)
      .attr("r", d => rScale(d.point_difference))
      .attr("fill", d => colorScale(d.cowboys_win))
  });