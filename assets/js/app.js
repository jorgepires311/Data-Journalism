var svgWidth = 1100;
var svgHeight = 600;
var margin = {
  top: 25,
  right: 25,
  bottom: 100,
  left: 100
};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(csvData) {

  // parse data
  csvData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.income = +data.income;
    data.healthcare = +data.healthcare;
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;
  });

  // xLinearScale function above csv import
  var xLinearScale =  d3.scaleLinear()
  .domain([d3.min(csvData, d => d.poverty)-1, d3.max(csvData, d => d.poverty)+1])
  .range([0, width]);

  // Create y scale function
  var yLinearScale =d3.scaleLinear()
  .domain([0, d3.max(csvData, d => d.healthcare)])
  .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g").call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(csvData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 10)
    .attr("class","stateCircle")


    circlesGroup = chartGroup.append("g").selectAll("text")
    .data(csvData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .attr("class", "stateText")
    .attr("dy",3)
    .text((d)=>d.abbr);

  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([0, 0])
    .html(function(d) {
      return (`<span>${d.state}</span><br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
    });
  chartGroup.call(toolTip);
  circlesGroup.on("click", function(data) {
    toolTip.show(data, this);
  })
    // .onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height/1.5))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width/2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");
});