/* global d3, scatter, barChart */

var scatterPlot = scatter();
var meanBarChart = barChart();

function visualize(data) {
  scatterPlot.data_bounds(data);
  meanBarChart.data_bounds(data);

  scatterPlot.callback(function(subset) {
    meanBarChart.filter_point(subset);
    meanBarChart.update_means();
    console.log("HERE");
  });

  function update() {
    d3.select("#scatterPlot")
      .datum(data)
      .call(scatterPlot);

    d3.select("#barChart")
      .datum(data)
      .call(meanBarChart);
  }

  update();
}

var dataPath = "./juggle.csv";
d3.csv(dataPath, d3.autoType).then(visualize);
