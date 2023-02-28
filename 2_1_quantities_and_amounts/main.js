
/* CONSTANTS AND GLOBALS */
// const width = ;
// const height = ;

/* LOAD DATA */
d3.csv('../[PATH_TO_YOUR_DATA]', d3.autoType) //auto type will read data and try to turn numbers into ints
  .then(data => {
    console.log("data", data)


    //dot looks for class, pound looks for id
  const table = d3.select("#container")
    .append("table")
    
    table.append("thead")
    table.append("tbody")
      .append("tr")
      .attr('class','row')

    const tobdy = table.append("tbody")

    const row = tobdy.selectAll("tr")
      .data(data)
      .join("tr")
      .attr("class", "student")
      .attr("id", data => data.Last)

      row.append("td")
        .text(data => data.Last)
      
      row.append("td")
        .text(data => data.First)




    /* SCALES */
    /** This is where you should define your scales from data to pixel space */
    

    /* HTML ELEMENTS */
    /** Select your container and append the visual elements to it */

  })