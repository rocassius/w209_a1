/* global d3 */

function scatter() {
  var margin = { left: 60, right: 60, top: 60, bottom: 60 },
    width = 600,
    height = 600,
    x = d3.scaleLinear().range([0, width]),
    y = d3.scaleLinear().range([height, 0]);

  function scatter_plot(selection) {
    selection.each(function(data) {
      var svg = d3
        .select(this)
        .selectAll("svg")
        .data([data]);

      var svgEnter = svg.enter().append("svg");
      var gEnter = svgEnter.append("g");
      gEnter.append("g").attr("class", "x axis");
      gEnter.append("g").attr("class", "y axis");

      // Update the outer dimensions.
      svg
        .merge(svgEnter)
        .attr("width", width)
        .attr("height", height);

      // Update the inner dimensions.
      var g = svg
        .merge(svgEnter)
        .select("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var maxAttempt = d3.max(data.map(d => +d.attempt));
      var maxClaps = d3.max(data.map(d => +d.claps));

      var pad = 1;
      x.domain([0 - pad, maxAttempt + pad]);
      y.domain([0 - pad, maxClaps + pad]);

      var legs = Array.from(new Set(data.map(d => d.leg)));
      var color = d3
        .scaleOrdinal()
        .domain(legs)
        .range(["#66ccff", "#ffcc66"]);

      var points = g
        .selectAll(".point")
        .data(function(d) {
          return d;
        })
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

      // g.selectAll("path.pt")
      //   .data(data)
      //   .enter()
      //   .append("path")
      //   .attr("class", "pt")
      //   .attr("d", d3.symbol().type(d3.symbolCircle))
      //   .style("fill", function(d) {
      //     return color(d.leg);
      //   })
      //   .attr("transform", function(d) {
      //     return "translate(" + x(d.attempt) + "," + y(d.claps) + ")";
      //   });

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

      points.exit().remove();
    });
  }

  scatter_plot.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return scatter_plot;
  };

  scatter_plot.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return scatter_plot;
  };

  scatter_plot.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return scatter_plot;
  };

  scatter_plot.x = function(_) {
    if (!arguments.length) return x;
    x = _;
    return scatter_plot;
  };

  scatter_plot.y = function(_) {
    if (!arguments.length) return y;
    y = _;
    return scatter_plot;
  };

  return scatter_plot;
}
