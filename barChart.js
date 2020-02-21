/* global d3 */

function barChart() {
  var margin = { left: 60, right: 60, top: 10, bottom: 90 },
    height = 400,
    barWidth = 40,
    svgWidth = 200,
    svgHeight = 600,
    space = 10,
    y = d3.scaleLinear().range([0, height]);

  var data_bounds = { maxAttempt: 100, maxClaps: 100 };
  var update_means = function() {};

  // Filtering function for points
  var filter_point = function() {
    return true;
  };

  function chart(selection) {
    selection.each(function(data) {
      // Select the svg element, if it exists.
      var svg = d3
        .select(this)
        .selectAll("svg")
        .data([data]);

      // Otherwise, create the skeletal chart.
      var svgEnter = svg.enter().append("svg");
      var gEnter = svgEnter.append("g");
      gEnter.append("g").attr("class", "x axis");
      gEnter.append("g").attr("class", "y axis");

      // Update the outer dimensions.
      svg
        .merge(svgEnter)
        .attr("width", svgWidth)
        .attr("height", svgHeight);

      var g = svg
        .merge(svgEnter)
        .select("g")
        .attr("width", barWidth * 2)
        .attr("height", height)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var pad = 1;
      y.domain([0, data_bounds.maxClaps + pad]);

      // color
      var legs = Array.from(new Set(data.map(d => d.leg)));
      var color = d3
        .scaleOrdinal()
        .domain(legs)
        .range(["#66ccff", "#ffcc66"]);

      var bars = g.selectAll(".bar");

      update_means = function() {
        // filter the data
        var dataSubset = Array.from(data).filter(filter_point);

        var map = d3.rollup(
          dataSubset,
          v => d3.mean(v, d => d.claps),
          d => d.leg
        );

        var meanData = legs.map(function(d) {
          return { leg: d, mean: map.has(d) ? map.get(d) : 0 };
        });

        // why doesn't this work????
        //bars.remove();

        g.selectAll(".bar").remove();

        var barsGroup = bars
          .data(meanData)
          .enter()
          .append("g")
          .attr("transform", function(d, i) {
            return (
              "translate(" +
              (space + 2 + i * (barWidth + space)) +
              "," +
              (height - y(d.mean)) +
              ")"
            );
          });

        barsGroup
          .append("rect")
          .attr("class", "bar")
          .attr("width", barWidth)
          .style("fill", d => color(d.leg))
          .attr("height", d => y(d.mean));

        g.selectAll(".value").remove();

        barsGroup
          .append("text")
          .attr("class", "value")
          .attr("y", -barWidth / 5)
          .attr("x", barWidth / 2)
          .text(d => d.mean.toFixed(2));
      };

      update_means();
    });
  }

  // The x-accessor for the path generator; xScale ∘ xValue.

  chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.y = function(_) {
    if (!arguments.length) return y;
    y = _;
    return chart;
  };

  // Function for setting the bounds of the data for the scatter d3.polygonCentroid(polygon)
  chart.data_bounds = function(data) {
    if (!arguments.length) return data_bounds;
    data_bounds.maxAttempt = d3.max(data.map(d => +d.attempt));
    data_bounds.maxClaps = d3.max(data.map(d => +d.claps));
    return chart;
  };

  chart.filter_point = function(_) {
    if (!arguments.length) return filter_point;
    filter_point = _;
    return filter_point;
  };

  // accessor function for updating the means
  chart.update_means = function() {
    update_means();
  };

  return chart;
}
