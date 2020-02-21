/* global d3 */

function scatter() {
  var margin = { left: 60, right: 30, top: 10, bottom: 90 },
    width = 400,
    height = 400,
    svgWidth = 550,
    svgHeight = 550,
    x = d3.scaleLinear().range([0, width]),
    y = d3.scaleLinear().range([height, 0]);

  var onBrushed = function() {};
  var callback = function() {};

  // Set dimensions for plot
  var data_bounds = { maxAttempt: 100, maxClaps: 100 };

  // Filtering function for points
  var filter_point = function() {
    return true;
  };

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
        .attr("width", svgWidth)
        .attr("height", svgHeight);

      onBrushed = function() {
        var s = d3.event.selection;
        var subset = function(d) {
          return s[0] <= x(d.attempt) && x(d.attempt) <= s[1] ? true : false;
        };
        subset_points(subset);
        callback(subset);
      };

      // Create brush for plot
      const brush = d3
        .brushX()
        .extent([
          [0, 0],
          [width + 20, height]
        ])
        .on("brush", onBrushed);

      // Update the inner dimensions.
      var g = svg
        .merge(svgEnter)
        .select("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(brush);

      var pad = 1;
      x.domain([0 - pad, data_bounds.maxAttempt + pad]);
      y.domain([0, data_bounds.maxClaps + pad]);

      var legs = Array.from(new Set(data.map(d => d.leg)));
      var color = d3
        .scaleOrdinal()
        .domain(legs)
        .range(["#66ccff", "#ffcc66"]);

      var points = g
        .selectAll(".point")
        .data(d => d)
        .enter()
        .filter(filter_point)
        .append("path")
        .attr("class", "pt")
        .attr("d", d3.symbol().type(d3.symbolCircle))
        .style("fill", function(d) {
          return color(d.leg);
        })
        .attr("transform", function(d) {
          return "translate(" + x(d.attempt) + "," + y(d.claps) + ")";
        });

      var subset_points = function(subset) {
        points
          .style("fill", function(d) {
            if (subset(d)) return color(d.leg);
            return "gray";
          })
          .style("opacity", function(d) {
            if (subset(d)) return 1;
            return 0.2;
          });
      };

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
            (height + margin.bottom / 3 + 5) +
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

      //descriptions
      g.append("text")
        .attr("class", "axis_label")
        .attr("text-anchor", "left")
        .attr(
          "transform",
          "translate(" + 0 + "," + (height + margin.bottom / 2 + 20) + ")"
        )
        .text("* brush the chart to subset points by attempt")
        .style("font-size", "10pt")
        .style("fill", "black")
        .style("font-style", "italic");

      g.append("text")
        .attr("class", "axis_label")
        .attr("text-anchor", "left")
        .attr(
          "transform",
          "translate(" + 0 + "," + (height + margin.bottom / 2 + 35) + ")"
        )
        .text("* hover over legend colors to subset points by leg")
        .style("font-size", "10pt")
        .style("fill", "black")
        .style("font-style", "italic");

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
            highlight_(d, false);
          })
          .on("mouseout", function(d) {
            highlight_(d, true);
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

      var highlight_ = function(leg, restoreColor) {
        // point // Why isn't this working anymore?
        g.selectAll("path.pt")
          .filter(function(d) {
            return d.leg === leg ? false : true;
          })
          //.style("fill", "white");
          .style("fill", function(d) {
            if (restoreColor) return color(d.leg);
            return "white";
          });
      };

      legend_();
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

  scatter_plot.callback = function(_) {
    if (!arguments.length) return callback;
    callback = _;
    return scatter_plot;
  };

  // Function for setting the bounds of the data for the scatter d3.polygonCentroid(polygon)
  scatter_plot.data_bounds = function(data) {
    if (!arguments.length) return data_bounds;
    data_bounds.maxAttempt = d3.max(data.map(d => +d.attempt));
    data_bounds.maxClaps = d3.max(data.map(d => +d.claps));
    return scatter_plot;
  };

  scatter_plot.filter_point = function(_) {
    if (!arguments.length) return filter_point;
    filter_point = _;
    return filter_point;
  };

  scatter_plot.onBrushed = function(_) {
    if (!arguments.length) return onBrushed;
    onBrushed = _;
    return scatter_plot;
  };

  return scatter_plot;
}
