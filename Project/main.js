/* CONSTANTS AND GLOBALS */
const width = 962,
  height = 550
  
//LOAD DATA: world map geojson
d3.json("../data/countries.geojson").then(geojson => {

  //CENSUS DATA READY FOR STACKED BAR CHARTS
  const stackedRace = [
    {loc:[54,100], value: "70,809", percent: 46, key: "pacific_island", title:"Pacific Islander", group: "main", index: 1},
    {loc: [18.5,54], value: "54,586", percent: 35.5, key: "asian", title: "Asian", group: "main", index: 2},
    {loc: [8.5,18.5], value: "15,441", percent: 10, key: "two_or_more", title:"Two or more", group: "main", index: 3},
    {loc: [1.7,8.5], value: "10,491", percent: 6.8, key: "whte", title: "White", group: "main", index: 4},
    {loc: [.8,1.7], value: "1,340", percent: .9, key: "black", title: "Black", group: "main", index: 5},
    {loc: [0,.8], value: "1,169", percent: .8, key: "other", title: "Other", group: "main", index: 6},
    {loc: [33,100], value: "50,420", percent: 67, key:"chamorro", title:"Chamorro", group: "pi", indigenous: "the Mariana Islands", index: 1},
    {loc: [18.5,33], value: "10,274", percent: 14.5, key:"chuukese", title:"Chuukese", group: "pi", indigenous: "Chuuk, Micronesia", index: 2},
    {loc: [13.7,18.5], value: "3,420", percent: 4.8, key:"race_other_pacific", title:"Other Pacific Islander Race", group: "pi", index: 3},
    {loc: [10.7,13.7], value: "2,149", percent: 3, key:"palauan", title:"Palauan", group: "pi", indigenous: "Palau", index: 4},
    {loc: [7.7,10.7], value: "2,096", percent: 3, key:"pohnpeian", title:"Pohnpeian", group: "pi", indigenous: "Pohnpei, Micronesia", index: 5},
    {loc: [5.5,7.7], value: "1,533", percent: 2.2, key:"yapese", title:"Yapese", group: "pi", indigenous: "Yap, Micronesia", index: 6},
    {loc: [4,5.5], value: "456", percent: 1.5, key:"kosraean", title:"Kosraean", group: "pi", indigenous: "Kosrae, Micronesia", index: 7},
    {loc: [3,4], value: "180", percent: .25, key:"marshallese", title:"Marshallese", group: "pi", indigenous: "the Marshall Islands", index: 8},
    {loc: [2,3], value: "126", percent: .17, key:"native_hawaiian", title:"Native Hawaiian", group: "pi", indigenous: "Hawaii", index: 9},
    {loc: [1,2], value: "92", percent: .13, key:"guamanian", title:"Guamanian", group: "pi", indigenous: "Guam", index: 10},
    {loc: [0,1], value: "63", percent: .09, key:"carolinian", title:"Carolinian", group: "pi", indigenous: "the Caroline Islands", index: 11},
    {loc: [21,100], value: "44,793", percent: 82, key:"fillipino", title: "Fillipino", indigenous: "the Phillipines", group: "asia", index: 1},
    {loc: [13.3,21], value: "3,438", percent: 7.7, key:"korean", title: "Korean", indigenous: "Korea", group: "asia", index: 2},
    {loc: [9.5,13.3], value: "2,108", percent: 3.8, key:"japanese", title: "Japanese", indigenous: "Japan", group: "asia", index: 3},
    {loc: [5.9,9.5], value: "1,999", percent: 3.6, key:"chinese", title: "Chinese", indigenous: "China", group: "asia", index: 4},
    {loc: [3,5.9], value: "1,600", percent: 2.9, key:"other_asian", title: "Other Asian Race", group: "asia", index: 5},
    {loc: [2,3], value: "283", percent: .5, key:"vietnamese", title: "Vietnamese", indigenous: "Vietnam", group: "asia", index: 6},
    {loc: [1,2], value: "227", percent: .4, key:"taiwanese", title: "Taiwanese", indigenous: "Taiwan", group: "asia", index: 7},
    {loc: [0,1], value: "138", percent: .2, key:"thai", title: "Thai", indigenous: "Thailand", group: "asia", index: 8}
  ]

  //SCALES
  const colorScale = d3.scaleOrdinal()            //coloring in countries
    .domain(['Guam'])
    .range(['aqua'])

  const raceScale = d3.scaleLinear()              //bar chart scale
    .domain([0, 100])
    .range([0, height/1.5])

  const racebarColorScale = d3.scaleOrdinal()     //bar chart race colors
    .domain(["Pacific Islander", "Asian", "Two or more", "White", "Black", "Other"])
    .range(["#ef476f", "#06d6a0", "#ffd166", "#a483b2","#D26059", "#118ab2"])

  const raceBreakdownColorScale = d3.scaleOrdinal() //race breakdown colors
    .domain(["chamorro", "chuukese", "race_other_pacific", "palauan", "pohnpeian", "yapese", "kosraean", "marshallese", "native_hawaiian", "guamanian", "carolinian",
            "fillipino", 'korean', 'japanese', 'chinese', 'other_asian', 'vietnamese', 'taiwanese', 'thai'])
    .range(["#782438", "#8f2b43", "#bf3959", "#f1597d", "#f26c8c", "#f47e9a", "#f591a9", "#f7a3b7", "#f9b5c5", "#fac8d4", "#fcdae2",
            '#025640', '#048060', '#05ab80', '#06d6a0', '#1fdaaa', '#51e2bd', '#83ebd0', '#b4f3e3'])
  
  //SVG
  const svg = d3.select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", "#009dc4")
    
  //MAP PROJECTION AND ZOOM
  const projection = d3.geoMercator()
    .rotate([-163,0])
    .center([0,20])

  var pathGen = d3.geoPath(projection)
  const guamCoord = projection([144,13])

  const g = d3.selectAll("svg").append("g")
  
  g.selectAll("path")
    .data(geojson.features)
    .join("path")
    .attr("class", "path")
    .attr("d", pathGen)
    .attr("fill", "green")
    .attr("stroke", "black")
    .attr("stroke-width", .01)
    .filter(d => d.properties.ADMIN === "Guam")
    .attr("fill", d => colorScale(d.properties.ADMIN))
  
  var zoom = d3.zoom().on('zoom', handleZoom)
  
  function handleZoom(e) {
    d3.select('g')
    .attr('transform', e.transform)
  }

  //HOME PAGE TEXT
  svg
    .append("rect")
    .attr("x", 30)
    .attr("y", 30)
    .attr("width", 390)
    .attr("height", 150)
    .attr("stroke", "black")
    .attr("fill", "white")
    .attr("opacity", .5) 
    .attr("id", "startingrect")
  svg
    .append("text")
    .attr("x", 40)
    .attr("y", 50)
    .text("Welcome to the Pacific Ocean!")
    .attr("class", "startingtext")
  svg
    .append("text")
    .attr("x", 40)
    .attr("y", 80)
    .text("How much do you know about the Pacific Islands?")
    .attr("class", "startingtext")
  svg
    .append("text")
    .attr("x", 40)
    .attr("y", 100)
    .text("You may have heard of Guam, one of the United States'")
    .attr("class", "startingtext")
  svg
    .append("text")
    .attr("x", 40)
    .attr("y", 120)
    .text("island territories, but do you know where it is?")
    .attr("class", "startingtext")
  svg
    .append("text")
    .attr("x", 40)
    .attr("y", 150)
    .text("Want to take a guess? Click on the map where you think")
    .attr("class", "startingtext")
  svg
    .append("text")
    .attr("x", 40)
    .attr("y", 170)
    .text("Guam is located.")
    .attr("class", "startingtext")
    

  
  //GUAM BOX FOR CLICKING IN
  d3
    .select('#container')
    .append('button')
    .attr('class', 'button')
    .attr("id", "guamButton")
    .style('top', guamCoord[1]+'px')
    .style('left', guamCoord[0]+'px')
    .style('visibility', 'hidden')

  let guessFlag = false   

  //CLICK TO GUESS WHERE GUAM IS
  svg.on("click", (e) => {
    if (guessFlag === false) {
      guessFlag = true    //ONLY ALLOW ONE GUAM GUESS
      //DRAW LINE BETWEEN GUAM AND GUESS
      const [mx, my] = d3.pointer(e)
      const guamLine = svg.append('line')
        .style("stroke", "red")
        .style("stroke-width", 1)
        .attr("x1", mx)
        .attr("y1", my)
        .attr("x2", mx)
        .attr("y2", my)
        .attr("id", "guamLine")
          .transition()
          .duration(3000)
        .attr("x2", guamCoord[0])
        .attr("y2", guamCoord[1])
          .on("end", function() {
            d3.select("#guamButton")
              .style("visibility", "visible")
            })

      svg.append('circle')
        .attr('cx', mx)
        .attr('cy', my)
        .attr('r', 5)
        .attr("fill", "red")
        .attr("id", "guessCircle")

      //CALCULATE DISTANCE BETWEEN GUESS AND GUAM
      const proj = projection.invert([mx, my])

      function distKM(lat1,lon1,lat2,lon2) {
          var a=Math,r=(lat2-lat1)*a.PI/180,c=(lon2-lon1)*a.PI/180,e=a.sin(r/2)*a.sin(r/2)+a.cos(lat1*a.PI/180)*a.cos(lat2*a.PI/180)*a.sin(c/2)*a.sin(c/2)
          return d=2*a.atan2(a.sqrt(e),a.sqrt(1-e))*6371
        }
      
      const length = distKM(proj[1],proj[0],13,145)

      //DISPLAY GUESS DISTANCE
      d3.selectAll(".startingtext")
        .remove()
  
      svg
        .append("text")
        .attr("x", 40)
        .attr("y", 90)
        .text("Your guess is")
        .attr("class", "startingtext")
      svg
        .append("text")
        .attr("x", 185)
        .attr("y", 90)
        .text("km away from Guam.")
        .attr("class", "startingtext")
      svg
        .append("text")
        .attr("x", 40)
        .attr("y", 120)
        .text("Click in to Guam to learn more!")
        .attr("class", "startingtext")

      //SHOW NUMBERS COUNTING UP FROM 1 TO DISTANCE 
      const distance = svg.append("text")
        .attr("x", 155)
        .attr("y", 90)
        .text(1)
        .attr("text-anchor", "middle")
        .attr("font-size", 20)
        .attr("class", "startingtext")
      
      distance
        .transition()
        .duration(3000)
        .tween("text", function() {
          var selection = d3.select(this)
          var start = d3.select(this).text()
          var end = length.toFixed(0)
          var interpolator = d3.interpolateNumber(start,end)
          return function(t) {selection.text(Math.round(interpolator(t)))} 
        })                
    }
  })

  //LEAVING WORLD MAP VIEW ENTERING GUAM VIEW
  let sel = d3.select("#guamButton").on('click', function(){
    //OLD TEXT FADE OUT
    sel
        .transition()
        .duration(1000)
      .style("opacity", 0)
      .remove()
    d3.select("#guamLine")
        .transition()
        .duration(1000)
      .style("opacity", 0)
      .remove()
    d3.select("#guessCircle") 
        .transition()
        .duration(1000)
      .style("opacity", 0)
      .remove()
    d3.selectAll(".startingtext")
        .transition()
        .duration(1000)
      .style("opacity", 0)
      .remove()
    d3.select("#startingrect")
        .transition()
        .duration(1000)
      .attr("opacity", 0)
      .remove()
    
    //ZOOM TRANSITION FROM WORLD VIEW TO GUAM VIEW
    svg
      .transition()
      .duration(7000)
        .call(zoom.transform, d3.zoomIdentity.translate(-107350,-66775).scale(250))
          .on("end", function() {
            //NEW TEXT FADE IN
            d3.select('.guamTitle')
              .style("visibility", "visible")
                .transition()
                .duration(1000)
              .attr("opacity", 1)
            d3.selectAll('.bar')
              .style("visibility", "visible")
                .transition()
                .duration(1000)
              .attr("opacity", 1)
            d3.selectAll('.mainlabel')
              .style("visibility", "visible")
                .transition()
                .duration(1000)
              .attr("opacity", 1)
            d3.selectAll('.guaminfo')
                .transition()
                .duration(1000)
              .attr("opacity", 1)
          })

    //GUAM TITLE
    d3.select("svg")
      .append("text")
      .text("GUAM")
      .attr("class", "guamTitle")
      .attr("x", width/2)
      .attr("y", height/5)
      .attr("font-size", 150)
      .attr("text-anchor", "middle")
      .attr("stroke", "black")
      .attr("stroke-width", 3)
      .attr("fill", "aqua")
      .attr("opacity", 0)
      .style("visibility", "hidden")

    //GUAM INFORMATION PARAGRAPH
    svg.append("text")
      .attr("x", 15)
      .attr("y", 130)
      .text("Total population: 153,836 (2020 US Census)")
      .attr("class", "guaminfo")
      .attr("opacity", 0)
    svg.append("text")
      .attr("x", 15)
      .attr("y", 160)
      .text("Guam is the largest and the southernmost of the Mariana Islands.")
      .attr("class", "guaminfo")
      .attr("opacity", 0)
    svg.append("text")
      .attr("x", 15)
      .attr("y", 180)
      .text("The Mariana Islands consist of Guam and the Northern Mariana")
      .attr("class", "guaminfo")
      .attr("opacity", 0)
    svg.append("text")
      .attr("x", 15)
      .attr("y", 200)
      .text("Islands, which is also a US territory and consists of the 14 other")
      .attr("class", "guaminfo")
      .attr("opacity", 0)
    svg.append("text")
      .attr("x", 15)
      .attr("y", 220)
      .text("islands in the Mariana Archipelago.")
      .attr("class", "guaminfo")
      .attr("opacity", 0)
    svg.append("text")
      .attr("x", 15)
      .attr("y", 250)
      .text("Guam became a US territory in 1898. Considered a strategically")
      .attr("class", "guaminfo")
      .attr("opacity", 0)
    svg.append("text")
      .attr("x", 15)
      .attr("y", 270)
      .text("important link between the US and Asia, it was captured by US")
      .attr("class", "guaminfo")
      .attr("opacity", 0)
    svg.append("text")
      .attr("x", 15)
      .attr("y", 290)
      .text(" forces from Spanish rule during the Spanish-American War.")
      .attr("class", "guaminfo")
      .attr("opacity", 0)
    svg.append("text")
      .attr("x", 15)
      .attr("y", 320)
      .text("During World War II, an invasion was launched on Guam by")
      .attr("class", "guaminfo")
      .attr("opacity", 0)
    svg.append("text")
      .attr("x", 15)
      .attr("y", 340)
      .text("Japanese forces from the Japanese-controlled Northern Mariana")
      .attr("class", "guaminfo")
      .attr("opacity", 0)
    svg.append("text")
      .attr("x", 15)
      .attr("y", 360)
      .text("Islands, resulting in a two-and-a-half year occupation by Japan.")
      .attr("class", "guaminfo")
      .attr("opacity", 0)
    svg.append("text")
      .attr("x", 15)
      .attr("y", 380)
      .text("When the war ended, the US took control of both Guam and the")
      .attr("class", "guaminfo")
      .attr("opacity", 0)
    svg.append("text")
      .attr("x", 15)
      .attr("y", 400)
      .text("Northern Mariana Islands.")
      .attr("class", "guaminfo")
      .attr("opacity", 0)
    svg.append("text")
      .attr("x", 15)
      .attr("y", 430)
      .text("Today, Guam houses a US Navy base along with 21,700 service")
      .attr("class", "guaminfo")
      .attr("opacity", 0)
    svg.append("text")
      .attr("x", 15)
      .attr("y", 450)
      .text("members who make up 14% of the island's population.")
      .attr("class", "guaminfo")
      .attr("opacity", 0)
    svg.append("text")
      .attr("x", 15)
      .attr("y", 480)
      .text("On the right is a bar chart displaying race data for Guam's")
      .attr("class", "guaminfo")
      .attr("opacity", 0)
    svg.append("text")
      .attr("x", 15)
      .attr("y", 500)
      .text("population according to the 2020 US census. Click on the bars")
      .attr("class", "guaminfo")
      .attr("opacity", 0)
    svg.append("text")
      .attr("x", 15)
      .attr("y", 520)
      .text("for more information.")
      .attr("class", "guaminfo")
      .attr("opacity", 0)
  })
    
  //RACE STACKED BAR CHART
  let filteredData 
  filteredData = stackedRace.filter(d => d.group === "main")

  const raceBar = svg.selectAll(".bar")
    .data(filteredData)
    .join("rect")
    .attr("class", "bar")
    .attr("id", d => d.key)
    .attr("x", 700)
    .attr("y", d => raceScale(d.loc[0]) + 80)
    .attr("height", d => raceScale(d.percent))
    .attr("width", 120)   
    .attr("stroke", "black")
    .attr("stroke-width", "2")
    .attr("fill", d => racebarColorScale(d.title))
    .attr("opacity", 0)
    .style("visibility", "hidden")

  //STACKED BAR CHART LABELS
  svg
    .append("text")
    .text("Pacific Islander")
    .attr("class", "mainlabel")
    .attr("x", 760)
    .attr("y", d => raceScale(54) + 80 + (raceScale(46)/2) - 7)
  svg
    .append("text")
    .text("(46%)")
    .attr("class", "mainlabel")
    .attr("x", 760)
    .attr("y", d => raceScale(54) + 80 + (raceScale(46)/2) + 7)
  svg
    .append("text")
    .text("Asian")
    .attr("class", "mainlabel")
    .attr("x", 760)
    .attr("y", d => raceScale(18.5) + 80 + (raceScale(35.5)/2) - 7)

  svg
    .append("text")
    .text("(35.5%)")
    .attr("class", "mainlabel")
    .attr("x", 760)
    .attr("y", raceScale(18.5) + 80 + (raceScale(35.5)/2) + 7)
  svg
    .append("text")
    .text("Two or more")
    .attr("class", "mainlabel")
    .attr("x", 760)
    .attr("y", raceScale(8.5) + 80 + (raceScale(10)/2) - 4)
  svg
    .append("text")
    .text("(10%)")
    .attr("class", "mainlabel")
    .attr("x", 760)
    .attr("y", d => raceScale(8.5) + 80 + (raceScale(10)/2) + 10)
  svg
    .append("text")
    .text("White")
    .attr("class", "mainlabel")
    .attr("x", 760)
    .attr("y", d => raceScale(1.7) + 80 + (raceScale(6.8)/2) - 4)
  svg
    .append("text")
    .text("(6.8%)")
    .attr("class", "mainlabel")
    .attr("x", 760)
    .attr("y", d => raceScale(1.7) + 80 + (raceScale(6.8)/2) + 10)

  d3.selectAll(".mainlabel")
    .attr("opacity", 0)
    .style("visibility", "hidden")


  const bars = d3.selectAll(".bar")

  //HIGHLIGHT BAR IN YELLOW ON MOUSEOVER AND BACK
  bars.on("mouseenter", (e,d) => {
    d3.select("#"+d.key)
        .transition()
      .style("stroke-width", "3")
      .style("stroke", "yellow")
  })
  bars.on("mouseout", (e,d) => {
    d3.select("#"+d.key)
        .transition()
      .style("stroke-width", "2")
      .style("stroke", "black")
  })

  let textflag = false
  let text2flag = false
      
  bars.on("click", (e,d) => {

  d3.selectAll(".labelmove")
    .remove()

  //DISPLAY WRITTEN OUT RACE DATA BASED ON CLICKED BAR
  svg.append("text")
    .html(d.percent + "%")
    .attr("x", 569)
    .attr("y", height + 20)
    .attr("id", "percent")
    .attr("font-weight", "bold")
    .attr("font-size", 16)
    .attr("text-anchor", "middle")
    .attr("class", "labelmove")
      .transition()
    .duration(600)
    .attr("y", 481)

  svg.append("text")
    .html(d.value)
    .attr("x", 441)
    .attr("y", height + 20)
    .attr("id", "percent")
    .attr("font-weight", "bold")
    .attr("font-size", 16)
    .attr("text-anchor", "end")
    .attr("class", "labelmove")
      .transition()
    .duration(600)
    .attr("y", 481)

  svg.append("text")
    .html(d.title)
    .attr("x", 533)
    .attr("y", height + 20)
    .attr("id", "race")
    .attr("font-weight", "bold")
    .attr("font-size", 16)
    .attr("text-anchor", "middle")
    .attr("class", "labelmove")
      .transition()
    .duration(600)
    .attr("y", 501)

  if (textflag == false) {    //DO NOT UPDATE THIS TEXT ON EVERY CLICK
    textflag = true
    svg
      .append("text")
      .text("total people or")
      .attr("x", 447)
      .attr("y", 481)
      .attr("opacity", 0)
      .attr("class", "label")
      .attr("id", "infotext") 
    svg
      .append("text")
      .text("of the total population in Guam identified")
      .attr("x", 593)
      .attr("y", 481)
      .attr("opacity", 0)
      .attr("class", "label")
      .attr("id", "infotext")
    svg
      .append("text")
      .text(" thier race as")
      .attr("x", 395)
      .attr("y", 502)
      .attr("opacity", 0)
      .attr("class", "label")
      .attr("id", "infotext")
    svg
      .append("text")
      .text("as categorized by the US census.")
      .attr("x", 586)
      .attr("y", 502)
      .attr("opacity", 0)
      .attr("class", "label")
      .attr("id", "infotext")

    d3.selectAll("#infotext")
        .transition()
        .duration(500)
      .attr("opacity", 1)
  }
        
  if (d.key === "pacific_island" || d.key === "asian") {
    svg
      .append("text")
      .html("Click to explore the breakdown of "+d.title+" races. Double click in bar to return.") 
      .attr("x", 395)
      .attr("y", 523)
      .attr("opacity", 0)
      .attr("class", "label")
      .attr("id", "deepertext")

    d3.selectAll("#deepertext")
        .transition()
        .duration(500)
      .attr("opacity", 1)
      
    d3.selectAll(".barPI")
      .remove()

    //COOL TRANSITION WHEN YOU CLICK INTO RACE WITH SUBSECTIONS
    svg.append('rect')
      .attr("class", "coverBar")
      .attr("x", 700)
      .attr("y", raceScale(d.loc[0]) + 80)
      .attr("height", raceScale(d.percent))
      .attr("width", 120)
      .attr("stroke", "black")
      .attr("stroke-width", "2")
      .attr("fill", racebarColorScale(d.title))
        .transition()
        .duration(1000)
      .attr("y", raceScale(0) + 80)
      .attr("height", raceScale(100))
             
    if (d.key === "pacific_island") {
      filteredData = stackedRace.filter(d => d.group === "pi")}

    if (d.key === "asian") {
      filteredData = stackedRace.filter(d => d.group === "asia")}

    let labelflag = false

    //RACE SUBSECTION BAR CHART OVER TOP MAIN RACE BAR CHART
    svg.selectAll(".barSubRace")
      .data(filteredData)
      .join("rect")
      .attr("class", "barSubRace")
      .attr("id", d => d.key)
      .attr("x", 700)
      .attr("y", d => raceScale(d.loc[0]) + 80)
      .attr("width", 120)
      .attr("stroke", "black")
      .attr("stroke-width", "2")
      .attr("fill", d => raceBreakdownColorScale(d.key))
      .attr("height", 0)
        .transition()
        .delay(1000)
        .duration(1000)
      .attr("height", d => raceScale(d.loc[1]-d.loc[0]))
        .on("end", function() {
            if (labelflag == false) {
              labelflag = true
              //LABEL RACE SUBSECTIONS ACCORDING TO WHICH RACE CATEGORY WAS CLICKED
              if (d.key === "pacific_island") {
                svg
                  .append("text")
                  .text("Chamorro")
                  .attr("class", "sublabel")
                  .attr("text-anchor", "middle")
                  .attr("x", 760)
                  .attr("y", raceScale(33) + 80 + (raceScale(67)/2) - 7)
                svg
                  .append("text")
                  .text("(67%)")
                  .attr("class", "sublabel")
                  .attr("text-anchor", "middle")
                  .attr("x", 760)
                  .attr("y", raceScale(33) + 80 + (raceScale(67)/2) + 7)
                svg
                  .append("text")
                  .text("Chuukese")
                  .attr("class", "sublabel")
                  .attr("text-anchor", "middle")
                  .attr("x", 760)
                  .attr("y", raceScale(18.5) + 80 + (raceScale(14.5)/2) - 7)
                svg
                  .append("text")
                  .text("(14.5%)")
                  .attr("class", "sublabel")
                  .attr("text-anchor", "middle")
                  .attr("x", 760)
                  .attr("y", d => raceScale(18.5) + 80 + (raceScale(14.5)/2) + 7)
              }

              if (d.key === "asian") {
                svg
                  .append("text")
                  .text("Fillipino")
                  .attr("class", "sublabel")
                  .attr("text-anchor", "middle")
                  .attr("x", 760)
                  .attr("y", raceScale(21) + 80 + (raceScale(82)/2) - 7)
                svg
                  .append("text")
                  .text("(82%)")
                  .attr("class", "sublabel")
                  .attr("text-anchor", "middle")
                  .attr("x", 760)
                  .attr("y", raceScale(21) + 80 + (raceScale(82)/2) + 7)
                svg
                  .append("text")
                  .text("Korean")
                  .attr("class", "sublabel")
                  .attr("text-anchor", "middle")
                  .attr("x", 760)
                  .attr("y", raceScale(13.3) + 80 + (raceScale(7.7)/2) - 3)
                svg
                  .append("text")
                  .text("(7.7%)")
                  .attr("class", "sublabel")
                  .attr("text-anchor", "middle")
                  .attr("x", 760)
                  .attr("y", raceScale(13.3) + 80 + (raceScale(7.7)/2) + 9)
              }  
            }

            const subRaceBars = svg.selectAll(".barSubRace")

            //HIGHLIGHT BARS ON MOUSEOVER AND BACK
            subRaceBars.on("mouseover", (e,d) => {
              d3.select("#"+d.key)
                .transition()
              .style("stroke-width", "3")
              .style("stroke", "yellow")
            })
            subRaceBars.on("mouseout", (e, d) => {
              d3.select("#"+d.key)
                .transition()
              .style("stroke-width", "2")
              .style("stroke", "black")
            })

            //BACK TO MAIN RACE BAR ON DOUBLE CLICK
            subRaceBars.on("dblclick", (e,d) => {
              //REMOVE EVERYTHING PERTAINING TO SUBSECTION BARS
              d3.selectAll(".coverBar")
                .remove()
              d3.selectAll(".label")
                .remove()
              d3.selectAll(".labelmove")
                .remove()
              d3.selectAll(".pilabel")
              .remove()
              d3.selectAll(".barsubRace")
                  .transition()
                  .duration(1000)
                .attr("height", 0)
              d3.selectAll(".barSubRace")
                .remove()
              d3.selectAll(".sublabel")
                .remove()
            
              textflag = false
              text2flag = false
            })

          //DISPLAY WRITTEN SUB RACE DATA ON CLICK ACCORDING TO WHICH BAR WAS CLICKED
          subRaceBars.on("click", (e,d) => {
            d3.selectAll(".label")
              .remove()
            d3.selectAll(".labelmove")
              .remove()

            svg.append("text")
              .html(d.percent + "%")
              .attr("x", 569)
              .attr("y", height + 20)
              .attr("id", "percent")
              .attr("font-weight", "bold")
              .attr("font-size", 16)
              .attr("text-anchor", "middle")
              .attr("class", "labelmove")
                .transition()
              .duration(600)
              .attr("y", 481)
    
            svg.append("text")
              .html(d.value)
              .attr("x", 441)
              .attr("y", height + 20)
              .attr("id", "percent")
              .attr("font-weight", "bold")
              .attr("font-size", 16)
              .attr("text-anchor", "end")
              .attr("class", "labelmove")
                .transition()
              .duration(600)
              .attr("y", 481)

            svg.append("text")
              .html(d.title)
              .attr("x", 481)
              .attr("y", height + 20)
              .attr("id", "race")
              .attr("font-weight", "bold")
              .attr("font-size", 16)
              .attr("text-anchor", "start")
              .attr("class", "labelmove")
                .transition()
              .duration(600)
              .attr("y", 502)

            if (d.group === "pi" && d.key !== "race_other_pacific") {
                svg
                .append("text")
                .html("The " + d.title + " people are indigenous to " + d.indigenous + ".")
                .attr("x", 395)
                .attr("y", 523)
                .attr("opacity", 0)
                .attr("class", "labelmove")
                .attr("id", "indigenous")

                d3.selectAll("#indigenous")
                    .transition()
                    .duration(500)
                  .attr("opacity", 1)
              }

            if (text2flag == false) {
              text2flag = true
              svg
                .append("text")
                .text("total people or")
                .attr("x", 447)
                .attr("y", 481)
                .attr("opacity", 0)
                .attr("class", "pilabel")
                .attr("id", "infotext") 
    
              console.log("d.group", d.group)
                if (d.group === "pi") {
                svg
                  .append("text")
                  .text("of the Pacific Islander population in Guam identified")
                  .attr("x", 593)
                  .attr("y", 481)
                  .attr("opacity", 0)
                  .attr("class", "pilabel")
                  .attr("id", "infotext")
              }

              if (d.group === "asia") {
                svg
                  .append("text")
                  .text("of the Asian population in Guam identified")
                  .attr("x", 593)
                  .attr("y", 481)
                  .attr("opacity", 0)
                  .attr("class", "pilabel")
                  .attr("id", "infotext")
              }
              svg
                .append("text")
                .text(" thier race as")
                .attr("x", 395)
                .attr("y", 502)
                .attr("opacity", 0)
                .attr("class", "pilabel")
                .attr("id", "infotext")

              d3.selectAll("#infotext")
                  .transition()
                  .duration(500)
                .attr("opacity", 1)

              console.log("d.group", d.group)
              console.log("d.key", d.key)
            }
          })
        })
      }
    })
  })