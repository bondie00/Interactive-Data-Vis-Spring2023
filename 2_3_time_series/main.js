 /* CONSTANTS AND GLOBALS */
 const width = window.innerWidth * 0.9,
 height = window.innerHeight * 0.9,
 margin = { top: 60, bottom: 40, left: 36, right: 10 }

/* LOAD DATA */
d3.csv("../data/NFCeastwins2022 - Sheet2.csv", d3.autoType)
  .then(data => {
    
    const svg = d3.select("#container2")
      .append('svg')
      .attr("width", width)
      .attr("height", height)
  
    //scales
    const xScale = d3.scaleLinear()
      .domain([1,18])
      .range([margin.left, width - margin.right])
  
    const yScale = d3.scaleLinear()
      .domain([0,50])
      .range([height - margin.bottom, margin.top])

    const colorScale = d3.scaleOrdinal()
      .domain("DAL_wins", "PHI_wins", "NYG_wins", "WAS_wins")
      .range(["#041E42", "#004C54", "#0B2265", "#5A1414"])

    //x-axis
    const xAxis = d3.axisBottom(xScale)
      .ticks(18)

    svg.append("g")
      .attr("class", "x-axis")
      .style("transform", `translate(0px, ${height - margin.bottom}px)`)
      .call(xAxis)
    
    svg.append("text")
      .attr("class", "xAxisLabel")
      .style("transform", `translate(${width/2}px, ${height - 5}px)`)
      .text("Schedule Week")
      .attr("fill", "black")
      .attr("text-anchor", "middle")

    //y-axis
    const yAxis = d3.axisLeft(yScale)
      .ticks(17)
  
  svg.append("g")
    .attr("class", "y-axis")
    .style("transform", `translate(${margin.left}px, 0px)`)
    .call(yAxis)
  
  svg.append("text")
    .attr("class", "yAxisLabel")
    .attr('transform', 'translate('+(margin.left - 35)+',' +height/2+ ') rotate(-90)')
    .text("Total number of wins")
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    
    //stack keys
    const stack = d3.stack()
      .keys(["DAL_wins", "PHI_wins", "NYG_wins", "WAS_wins"])
      //(data)
  
    //area generator
    const area = d3.area()
      .x(d => xScale(d.data.schedule_week))
      .y0(d => yScale(d[0]))
      .y1(d => yScale(d[1]))

    //construct stack
    const stackedValues = stack(data)

   console.log("data", data)
    console.log("stackedValues", stackedValues)

    const stackedData = []
    
    stackedValues.forEach((layer, index) => {
      const currentStack = []
      layer.forEach((d, i, dataArray) => {
        currentStack.push({
          values: d,
          week: data[i].schedule_week,
          key: dataArray.key
        })
      })
      stackedData.push(currentStack)
    })

console.log("stackedData", stackedData)
    
    //append stacked bar chart areas
    const chart = svg.selectAll(".series")
      .data(stackedValues)
      .join("path")
      .attr("class", "series")
      .attr("d", d => {console.log("d", d)})
      .attr("d", d => area(d))
      .attr("stroke", "black")
      .attr("fill", "none")
      .attr("fill", d => colorScale(d.key))
});

    
    //**************************TOP ROW CHARTS***********************************

d3.csv("../data/NFCeastwins2022.csv", d3.autoType)
  .then(data => {
    
    const svg = d3.select("#subcontainerLL")
      .append('svg')
      .attr("width", width/4)
      .attr("height", height/2)
  
    //scales
    const xScale = d3.scaleLinear()
      .domain([1,18])
      .range([margin.left, width/4 - margin.right])
  
    const yScale = d3.scaleLinear()
      .domain([0,17])
      .range([height/2 - margin.bottom, margin.top])

    const colorScale = d3.scaleOrdinal()
      .domain("DAL_wins", "PHI_wins", "NYG_wins", "WAS_wins")
      .range(["#041E42", "#004C54", "#0B2265", "#5A1414"])

    const DAL = data.filter(d => d.team === "DAL")

    const area = d3.area()
      .x(d => xScale(d.schedule_week))
      .y0(yScale(0))
      .y1(d => yScale(d.number_wins))

    const lineGen = d3.line()
      .x(d => xScale(d.schedule_week))
      .y(d => yScale(d.number_wins))

      svg.selectAll(".line")
        .data([DAL])
        .join("path")
        .attr("class", "line")
        .attr("fill", "#041E42")
        .attr("d", d=>area(d))

      //x-axis
    const xAxis = d3.axisBottom(xScale)
      .ticks(9)

    svg.append("g")
      .attr("class", "x-axis")
      .style("transform", `translate(0px, ${height/2 - margin.bottom}px)`)
      .call(xAxis)
    
    svg.append("text")
      .attr("class", "xAxisLabel")
      .style("transform", `translate(${(width/4)/2 + 10}px, ${height/2 - 5}px)`)
      .text("Schedule Week")
      .attr("fill", "black")
      .attr("text-anchor", "middle")
      .attr("font-size", "10pt")
      .attr("font-weight", "bold")

    //y-axis
    const yAxis = d3.axisLeft(yScale)
      .ticks(9)
  
  svg.append("g")
    .attr("class", "y-axis")
    .style("transform", `translate(${margin.left}px, 0px)`)
    .call(yAxis)
  
  svg.append("text")
    .attr("class", "yAxisLabel")
    .attr('transform', 'translate('+(margin.left - 25) +',' +(((height/2)/2) + 10) + ') rotate(-90)')
    .text("Number of wins")
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .attr("font-size", "10pt")
    .attr("font-weight", "bold")

    svg.append("text")
      .attr("class", "title")
      .style("transform", `translate(${(width/4)/2 + 15}px, ${margin.top + 10}px)`)
      .text("Cowboys 2022 season")
      .attr("fill", "black")
      .attr("text-anchor", "middle")

  
    const svg2 = d3.select("#subcontainerL")
    .append('svg')
    .attr("width", width/4)
    .attr("height", height/2)

  //scales

  const PHI = data.filter(d => d.team === "PHI")

    svg2.selectAll(".line")
      .data([PHI])
      .join("path")
      .attr("class", "line")
      .attr("fill", "#004C54")
      .attr("d", d=>area(d))

    //x-axis

  svg2.append("g")
    .attr("class", "x-axis")
    .style("transform", `translate(0px, ${height/2 - margin.bottom}px)`)
    .call(xAxis)
  
  svg2.append("text")
    .attr("class", "xAxisLabel")
    .style("transform", `translate(${width}px, ${height - 5}px)`)
    .text("Schedule Week")
    .attr("fill", "black")
    .attr("text-anchor", "middle")

  //y-axis

svg2.append("g")
  .attr("class", "y-axis")
  .style("transform", `translate(${margin.left}px, 0px)`)
  .call(yAxis)

  svg2.append("text")
      .attr("class", "title")
      .style("transform", `translate(${(width/4)/2 + 15}px, ${margin.top + 10}px)`)
      .text("Eagles 2022 season")
      .attr("fill", "black")
      .attr("text-anchor", "middle")


  const svg3 = d3.select("#subcontainerR")
    .append('svg')
    .attr("width", width/4)
    .attr("height", height/2)

  //scales

  const NYG = data.filter(d => d.team === "NYG")

    svg3.selectAll(".line")
      .data([NYG])
      .join("path")
      .attr("class", "line")
      .attr("fill", "#0B2265")
      .attr("d", d=>area(d))

    //x-axis

  svg3.append("g")
    .attr("class", "x-axis")
    .style("transform", `translate(0px, ${height/2 - margin.bottom}px)`)
    .call(xAxis)
  
  svg3.append("text")
    .attr("class", "xAxisLabel")
    .style("transform", `translate(${width}px, ${height - 5}px)`)
    .text("Schedule Week")
    .attr("fill", "black")
    .attr("text-anchor", "middle")

    svg3.append("text")
      .attr("class", "title")
      .style("transform", `translate(${(width/4)/2 + 15}px, ${margin.top + 10}px)`)
      .text("Giants 2022 season")
      .attr("fill", "black")
      .attr("text-anchor", "middle")

  //y-axis

svg3.append("g")
  .attr("class", "y-axis")
  .style("transform", `translate(${margin.left}px, 0px)`)
  .call(yAxis)



  const svg4 = d3.select("#subcontainerRR")
    .append('svg')
    .attr("width", width/4)
    .attr("height", height/2)

  //scales

  const WAS = data.filter(d => d.team === "WAS")

    svg4.selectAll(".line")
      .data([WAS])
      .join("path")
      .attr("class", "line")
      .attr("fill", "#5A1414")
      .attr("d", d=>area(d))

    //x-axis

  svg4.append("g")
    .attr("class", "x-axis")
    .style("transform", `translate(0px, ${height/2 - margin.bottom}px)`)
    .call(xAxis)
  
  svg4.append("text")
    .attr("class", "xAxisLabel")
    .style("transform", `translate(${width}px, ${height - 5}px)`)
    .text("Schedule Week")
    .attr("fill", "black")
    .attr("text-anchor", "middle")

    svg4.append("text")
      .attr("class", "title")
      .style("transform", `translate(${(width/4)/2 + 19}px, ${margin.top + 10}px)`)
      .text("Commanders 2022 season")
      .attr("fill", "black")
      .attr("text-anchor", "middle")

  //y-axis

svg4.append("g")
  .attr("class", "y-axis")
  .style("transform", `translate(${margin.left}px, 0px)`)
  .call(yAxis)


});
