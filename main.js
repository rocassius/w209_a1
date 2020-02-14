scatterPlot = scatter();

function visualize(data) {
  var cs = crossfilter(data);
  cs.dimClaps = cs.dimension(function(d) {
    return d.claps;
  });
  cs.dimAttempt = cs.dimension(function(d) {
    return d.attempt;
  });
  cd.dimLeg = cs.dimension(function(d) {
    return d.leg;
  });

  function update() {
    //...
  }

  update();
}

var dataPath = "./juggle.csv";
d3.csv(dataPath, d3.autoType).then(visualize);
