const width = window.innerWidth * 0.7,
height = window.innerHeight * 0.7,
  margin = 65;

/* LOAD DATA */
d3.csv("../data/squirrelActivities.csv", d3.autoType).then(Squirrel => {
  console.log("data", Squirrel)


  //dot looks for class, pound looks for id
const table = d3.select("#container")
  .append("table")
  
  table.append("thead")
  table.append("tbody")
    .append("tr")
    .attr('class','row')

  const tobdy = table.append("tbody")

  const row = tobdy.selectAll("tr")
    .data(Squirrel)
    .join("tr")
    .attr("activity", "count")

    row.append("td")
      .text(data => data.activity)
    
    row.append("td")
      .text(data => data.count)


  /* SCALES */
  /** This is where you should define your scales from data to pixel space */
  const yScale = d3.scaleBand()
    .domain(['running', 'chasing', 'climbing', 'eating', 'foraging'])
    .range([margin, height - margin])
    .padding(0.2)

  const xScale = d3.scaleLinear()
    .domain([0, Math.max(...Squirrel.map(d => d.count))])
    .range([margin, width - margin])



  /* HTML ELEMENTS */
  /** Select your container and append the visual elements to it */
  const svg = d3.select("#container").append("svg")
      .attr("width", width)
      .attr("height", height)

  svg.selectAll("rect.bar")
    .data(Squirrel)
    .join("rect")
    .attr("class", "bar")
    .attr("y", d => yScale(d.activity))
    .attr("x", margin)
    .attr("height", yScale.bandwidth())
    .attr("width", d => xScale(d.count) - margin)

    const yAxis = d3.axisLeft(yScale)
    const xAxis = d3.axisBottom(xScale)

    svg
      .append("g")
      .attr("class", "x-axis")
      .style("transform", `translate(0px, ${height - margin}px)`)
      .call(xAxis)

      svg
        .append("text")
        .attr("class", "xAxisLabel")
        .attr("y", height - margin + 35)
        .attr("x", width/2)
        .text("Count (number of times observed)")
        .attr("fill", "black")
        .attr("text-anchor", "middle")


    svg
      .append("g")
      .attr("class", "y-axis")
      .style("transform", `translate(${margin}px, 0px)`)
      .call(yAxis)

      svg
        .append("text")
        .attr("class", "yAxisLabel")
        .attr("y", 12)
        .attr("x", 0 - height/2)
        .attr("transform", "rotate(-90)")
        .text("Squirrel Activity")
        .attr("fill", "black")
        .attr("text-anchor", "middle")
      

      svg.selectAll("text.dataLabel")
        .data(Squirrel)
        .join("text")
        .attr("class", "dataLabel")
        .text(d => d.count)
        .attr("x", d => xScale(d.count) + 15)
        .attr("y", d => yScale(d.activity) + yScale.bandwidth() / 2)
        .attr("fill" , "black")
        .attr("font-size", "9pt")
        .attr("text-anchor", "middle")

    




})