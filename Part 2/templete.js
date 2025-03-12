// Load the data
const socialMedia = d3.csv("socialMedia.csv");

// Once the data is loaded, proceed with plotting
socialMedia.then(function(data) {
    // Convert string values to numbers
    data.forEach(function(d) {
        d.Likes = +d.Likes;
    });

    // Define the dimensions and margins for the SVG

    let width = 600; height = 400;

    let margin = {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50
    }

    // Create the SVG container
    let svg = d3.select('#boxplot').append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('background', 'lightyellow');

    // Set up scales for x and y axes
    // You can use the range 0 to 1000 for the number of Likes, or if you want, you can use
    // d3.min(data, d => d.Likes) to achieve the min value and 
    // d3.max(data, d => d.Likes) to achieve the max value
    // For the domain of the xscale, you can list all four platforms or use
    // [...new Set(data.map(d => d.Platform))] to achieve a unique list of the platform
    
    let yScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.Likes), d3.max(data, d => d.Likes)])
    .range([height - margin.bottom, margin.top]);

    let xScale = d3.scaleBand()
    .domain([...new Set(data.map(d => d.Platform))])
    .range([margin.left, width - margin.right])
    .padding(0.5);

    let yaxis = svg.append('g')
    .call(d3.axisLeft(yScale))
    .attr('transform', `translate(${margin.left},0)`); 

    let xaxis = svg.append('g')
    .call(d3.axisBottom(xScale))
    .attr('transform', `translate(0,${height - margin.bottom})`);

    // Add x-axis label
    svg.append('text')
    .attr('x', width / 2)
    .attr('y', height - 15)
    .text('Platform');



    // Add y-axis label
    svg.append('text')
    .attr('x', -height / 1.5)
    .attr('y', 15)
    .attr('transform', 'rotate(-90)')
    .text('Number of Likes');


    const rollupFunction = function(groupData) {
        const values = groupData.map(d => d.Likes).sort(d3.ascending);
        const min = d3.min(values); 
        const q1 = d3.quantile(values, 0.25);
        const q3 = d3.quantile(values, 0.75);
        const median = d3.quantile(values, 0.50);
        const max = d3.max(values);
        return {min, q1, q3, median, max};
    };

    const quantilesByGroups = d3.rollup(data, rollupFunction, d => d.Platform);

    quantilesByGroups.forEach((quantiles, Platform) => {
        const x = xScale(Platform);
        const boxWidth = xScale.bandwidth();
        const { min, q1, q3, median, max } = quantiles;

        // vertical line
        svg.append('line')
        .attr('x1', x + boxWidth / 2)  
        .attr('y1', yScale(min))        
        .attr('x2', x + boxWidth / 2)  
        .attr('y2', yScale(max))        
        .attr('stroke', 'black')
        .attr('stroke-width', 2);

        // box
        svg.append('rect')
        .attr('x', x)                   
        .attr('y', yScale(q3))         
        .attr('width', boxWidth)        
        .attr('height', yScale(q1) - yScale(q3)) 
        .attr('fill', 'lightblue')     
        .attr('stroke', 'black'); 

        // median line
        svg.append('line')
        .attr('x1', x)                     
        .attr('y1', yScale(median))         
        .attr('x2', x + boxWidth)           
        .attr('y2', yScale(median))         
        .attr('stroke', 'black')            
        .attr('stroke-width', 2);
        
    });

    // This line groups the dataset data by the species and applies a rollup function so that we can calculate the quartiles for each species
    const quartilesBySpecies = d3.rollup(data, rollupFunction, d => d.species);
    
    // This line iterates over each species to determine the x-position and width of each box in a box plot
    quartilesBySpecies.forEach((quartiles, species) => {
        const x = xScale(species);
        const boxWidth = xScale.bandwidth();
        
    });
});

// Prepare you data and load the data again. 
// This data should contains three columns, platform, post type and average number of likes.
const socialMediaAvg = d3.csv("socialMediaAvg.csv");

socialMediaAvg.then(function(data) {
    // Convert string values to numbers
    data.forEach(function(d) {
      d.Likes = +d.Likes;
  });

    // Define the dimensions and margins for the SVG
    let width = 600; height = 400;

    let margin = {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50
    }

    // Create the SVG container
    let svg = d3.select('#barplot').append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('background', 'lightblue');

    // Define four scales
    // Scale x0 is for the platform, which divide the whole scale into 4 parts
    // Scale x1 is for the post type, which divide each bandwidth of the previous x0 scale into three part for each post type
    // Recommend to add more spaces for the y scale for the legend
    // Also need a color scale for the post type

    // for each platform
    const x0 = d3.scaleBand()
      .domain([...new Set(data.map(d => d.Platform))])
      .range([margin.left, width - margin.right])
      .padding(0.1);
      
    // for each post type on each platform
    const x1 = d3.scaleBand()
      .domain([...new Set(data.map(d => d.PostType))])
      .range([0, x0.bandwidth()])
      .padding(0.05);

    const y = d3.scaleLinear()
      .domain([d3.min(data, d => d.Likes), d3.max(data, d => d.Likes)])
      .range([height - margin.bottom, margin.top]);
      

    const color = d3.scaleOrdinal()
      .domain([...new Set(data.map(d => d.PostType))])
      .range(["#1f77b4", "#ff7f0e", "#2ca02c"]);   
      
      
         
    // Add scales x0 and y     
    let yaxis = svg.append('g')
    .call(d3.axisLeft(y))
    .attr('transform', `translate(${margin.left},0)`); 

    let xaxis = svg.append('g')
    .call(d3.axisBottom(x0))
    .attr('transform', `translate(0,${height - margin.bottom})`);

    // Add x-axis label
    svg.append('text')
    .attr('x', width / 2)
    .attr('y', height - 15)
    .text('Platform and Post Type');

    // Add y-axis label
    svg.append('text')
    .attr('x', -height / 1.5)
    .attr('y', 15)
    .attr('transform', 'rotate(-90)')
    .text('Number of Likes');


  // Group container for bars
    const barGroups = svg.selectAll("bar")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", d => `translate(${x0(d.Platform)},0)`);

  // Draw bars
    barGroups.append("rect")
      .attr("x", d => x1(d.PostType))  
      .attr("y", d => y(d.Likes))  
      .attr("width", x1.bandwidth())  
      .attr("height", d => height - margin.bottom - y(d.Likes))  
      .attr("fill", d => color(d.PostType)) 
      .attr("stroke", "black"); 
      

    // Add the legend
    const legend = svg.append("g")
      .attr("transform", `translate(${width - 150}, ${margin.top})`);

    const types = [...new Set(data.map(d => d.PostType))];
 
    types.forEach((type, i) => {

    // Alread have the text information for the legend. 
    // Now add a small square/rect bar next to the text with different color.

    legend.append("rect")
      .attr("x", 0)  
      .attr("y", i * 20)  
      .attr("width", 15)  
      .attr("height", 15)  
      .attr("fill", color(type));

      legend.append("text")
          .attr("x", 20)
          .attr("y", i * 20 + 12)
          .text(type)
          .attr("alignment-baseline", "middle");
  });

});

// Prepare you data and load the data again. 
// This data should contains two columns, date (3/1-3/7) and average number of likes. 

const socialMediaTime = d3.csv("socialMediaTime.csv");

socialMediaTime.then(function(data) {
    // Convert string values to numbers
    data.forEach(function(d) {
      d.Likes = +d.Likes;
  });

    // Define the dimensions and margins for the SVG
    let width = 600; height = 400;

    let margin = {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50
    }

    // Create the SVG container
    let svg = d3.select('#lineplot').append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('background', 'lightgreen');


    let xScale = d3.scaleBand()
      .domain([...new Set(data.map(d => d.Date))])
      .range([margin.left, width - margin.right]);


    let yScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.Likes), d3.max(data, d => d.Likes)]) 
        .range([height - margin.bottom, margin.top]);

    // Draw the axis, you can rotate the text in the x-axis here
    let yaxis = svg.append('g')
    .call(d3.axisLeft(yScale))
    .attr('transform', `translate(${margin.left},0)`); 

    let xaxis = svg.append('g')
    .call(d3.axisBottom(xScale))
    .attr('transform', `translate(0,${height - margin.bottom})`);

    // Add x-axis label
    svg.append('text')
    .attr('x', width / 2)
    .attr('y', height - 15)
    .text('Date');

    // Add y-axis label
    svg.append('text')
    .attr('x', -height / 1.5)
    .attr('y', 15)
    .attr('transform', 'rotate(-90)')
    .text('Number of Likes');

    // Draw the line and path. Remember to use curveNatural. 
    let line = d3.line()
        .x(d => xScale(d.Date))
        .y(d => yScale(d.Likes))
        .curve(d3.curveNatural);  

    // Add the line path to the SVG
    svg.append("path")
        .data([data])  
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2);

});
