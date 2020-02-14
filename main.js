/* global d3, crossfilter */

var viz_lib = {};

viz_lib.scatter = function(data) {
  var svg = d3.select("svg").attr("transform", "translate(200, 0)"),
    margin = { left: 60, right: 60, top: 60, bottom: 60 },
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom,
    onBrushed = function() {};

  var g = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(d3.brushX().on("brush", onBrushed));

  var x = d3.scaleLinear().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  var legs = Array.from(new Set(data.map(d => d.leg)));
  var color = d3
    .scaleOrdinal()
    .domain(legs)
    .range(["#66ccff", "#ffcc66"]);

  var point = g.selectAll("path.pt");

  var plot_ = function() {
    var maxAttempt = d3.max(data.map(d => +d.attempt));
    var maxClaps = d3.max(data.map(d => +d.claps));

    var pad = 1;
    x.domain([0 - pad, maxAttempt + pad]);
    y.domain([0 - pad, maxClaps + pad]);

    point
      .data(data)
      .enter()
      .append("path")
      .attr("class", "pt")
      .attr("d", d3.symbol().type(d3.symbolCircle))
      .style("fill", function(d) {
        return color(d.leg);
      })
      .attr("transform", function(d) {
        return "translate(" + x(d.attempt) + "," + y(d.claps) + ")";
      });

    g.append("g")
      .attr("class", "axis_x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    g.append("g")
      .attr("class", "axis_y")
      .call(d3.axisLeft(y));

    g.append("text")
      .attr("class", "axis_label")
      .attr("text-anchor", "middle")
      .attr(
        "transform",
        "translate(" +
          width / 2 +
          "," +
          (height + (2 * margin.bottom) / 3) +
          ")"
      )
      .text("Attempt");

    g.append("text")
      .attr("class", "axis_label")
      .attr("text-anchor", "middle")
      .attr(
        "transform",
        "translate(" + -margin.left / 2 + "," + height / 2 + ")rotate(-90)"
      )
      .text("Number of Claps");

    g.append("text")
      .attr("class", "title")
      .attr("x", width / 2)
      .attr("y", 0 - margin.top / 2)
      .attr("text-anchor", "middle")
      .text("Juggling Claps and Attempt Number")
      .style("fill", "gray");
  };

  var legend_ = function() {
    var legend = { x: 30, y: 40, space: 45, r: 10 };

    g.attr("class", "legend")
      .selectAll("dots")
      .data(legs)
      .enter()
      .append("circle")
      .attr("cx", function() {
        return legend.x;
      })
      .attr("cy", function(d, i) {
        return legend.y + legend.space * i;
      })
      .attr("r", legend.r)
      .style("fill", function(d) {
        return color(d);
      })
      .on("mouseover", function(d) {
        highlight_leg_(d, false);
      })
      .on("mouseout", function(d) {
        highlight_leg_(d, true);
      });

    g.selectAll("label")
      .data(legs)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", function() {
        return legend.x + 2 * legend.r;
      })
      .attr("y", function(d, i) {
        return legend.y + legend.space * i;
      })
      .text(function(d) {
        return d + " leg";
      })
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")
      .style("fill", function(d) {
        return color(d);
      });
  };

  var highlight_leg_ = function(leg, restoreColor) {
    // point // Why isn't this working anymore?
    g.selectAll("path.pt")
      .filter(function(d) {
        return d.leg === leg ? false : true;
      })
      .style("fill", function(d) {
        if (restoreColor) return color(d.leg);
        return "white";
      });
  };

  onBrushed = function(selection) {
    selection.selectAll("path.pt").style("fill", function(d) {
      console.log(d.leg);
      return "firebrick";
    });
  };

  var onBrushed_ = function(_) {
    if (!arguments.length) return onBrushed;
    onBrushed = _;
    return onBrushed;
  };

  var _public = {
    plot: plot_,
    legend: legend_,
    highlight: highlight_leg_,
    onBrushed: onBrushed_
  };

  return _public;
};

function visualize(data) {
  var cs = crossfilter(data);

  console.log(cs);

  function update() {
    // Plot the data

    var scatter = viz_lib.scatter(data);
    scatter.plot();
    scatter.legend();
    // scatter.highlight("left");
  }

  update();
}

var dataPath = "./juggle.csv";
d3.csv(dataPath, d3.autoType).then(visualize);
