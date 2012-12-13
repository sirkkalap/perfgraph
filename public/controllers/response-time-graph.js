(function() {

  define(["jquery", "d3", "page"], function($, d3, page) {
    var ResponseTimeGraph;
    return ResponseTimeGraph = (function() {

      function ResponseTimeGraph(canvas, currentBuild) {
        var data, graph, height, line, m, n, width, x, xAxis, y, yAxis;
        height = canvas.height();
        width = canvas.width();
        data = (function() {
          var _i, _results;
          _results = [];
          for (n = _i = 1; _i <= 29; n = ++_i) {
            _results.push({
              build: n,
              measurements: (function() {
                var _j, _results1;
                _results1 = [];
                for (m = _j = 0; _j <= 8; m = ++_j) {
                  _results1.push(20 * Math.random());
                }
                return _results1;
              })()
            });
          }
          return _results;
        })();
        currentBuild || (currentBuild = []);
        data.map(function(d) {
          d.measurements.sort(d3.ascending);
          d.min = d3.min(d.measurements);
          d.max = d3.max(d.measurements);
          d.median = d3.median(d.measurements);
          d.lowerPercentile = d3.quantile(d.measurements, 0.25);
          d.upperPercentile = d3.quantile(d.measurements, 0.75);
          return d;
        });
        x = d3.scale.linear().domain([0, data.length + 1]).range([0, width]);
        y = d3.scale.linear().domain([0, 30]).range([height, 0]);
        xAxis = d3.svg.axis().scale(x).ticks(0).tickSize(0);
        yAxis = d3.svg.axis().scale(y).orient("left").ticks(3).tickSize(3);
        graph = d3.select(canvas[0]);
        line = d3.svg.line().x(function(d) {
          return x(d[0]);
        }).y(function(d) {
          return y(d[1]);
        });
        graph.selectAll(".current-build").data(currentBuild).enter().append("path").attr("d", function(currentBuild, i) {
          return line([[currentBuild, 0], [currentBuild, -1.5]]);
        }).attr("class", "current-build");
        graph.selectAll(".boxplot.min-max").data(data).enter().append("path").attr("d", function(d, i) {
          return line([[d.build, d.min], [d.build, d.max]]);
        }).attr("class", "boxplot min-max");
        graph.selectAll(".boxplot.percentiles").data(data).enter().append("path").attr("d", function(d, i) {
          return line([[d.build, d.lowerPercentile], [d.build, d.upperPercentile]]);
        }).attr("class", "boxplot percentiles").on("click", function(d) {
          return page("/reports/" + d.build);
        });
        graph.selectAll(".boxplot.median").data(data).enter().append("path").attr("d", function(d, i) {
          return line([[d.build - 0.2, d.median], [d.build + 0.2, d.median]]);
        }).attr("class", "boxplot median");
        graph.append("g").attr("class", "axis").call(yAxis);
        graph.append("g").attr("class", "axis").attr("transform", "translate(0, " + height + ")").call(xAxis);
      }

      return ResponseTimeGraph;

    })();
  });

}).call(this);
