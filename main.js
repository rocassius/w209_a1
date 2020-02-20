/* global d3, scatter */

var scatterPlot = scatter();

function visualize(data) {
  scatterPlot.data_bounds(data);

  scatterPlot.onBrushed(function() {
    var s = d3.event.selection;
    console.log(s);
    var x = scatterPlot.x;
    scatterPlot.filter_point = function(d) {
      return s[0] <= x(d.attempt) && x(d.attempt) <= s[1] ? true : false;
    };
    update(data);
  });

  // scatterPlot.filter_point(function(d) {
  //   return d.leg === "left" ? true : false;
  // });

  function update(data) {
    d3.selection("#scatterPlot")
      .datum(data)
      .call(scatterPlot);
  }

  update(data);
}

var dataPath = "./juggle.csv";
d3.csv(dataPath, d3.autoType).then(visualize);
