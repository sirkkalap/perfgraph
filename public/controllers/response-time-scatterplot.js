(function() {

  define(["jquery", "d3"], function($, d3) {
    var ResponseTimeScatterPlot;
    return ResponseTimeScatterPlot = (function() {

      function ResponseTimeScatterPlot(canvas, url) {
        var height, sample, width;
        sample = $('.report .sample');
        height = canvas.height();
        width = canvas.width();
        $.getJSON(url, function(data) {
          var graph, showSample, x, xAxis, y, yAxis;
          x = d3.scale.linear().domain([
            d3.min(data, function(d) {
              return d.timeStamp;
            }), d3.max(data, function(d) {
              return d.timeStamp;
            }) + 5
          ]).range([0, width]);
          y = d3.scale.linear().domain([
            0, d3.max(data, function(d) {
              return d.elapsedTime;
            })
          ]).range([height, 0]).nice();
          showSample = function(d) {
            sample.find('.elapsedTime').text("" + d.elapsedTime + " s");
            sample.find('.responseCode').text(d.responseCode);
            sample.find('.bytes').text("" + d.bytes + " B");
            return sample.find('.label').text(d.label).attr("href", d.label);
          };
          xAxis = d3.svg.axis().scale(x);
          yAxis = d3.svg.axis().scale(y).orient("left").ticks(6);
          graph = d3.select(canvas[0]);
          graph.selectAll(".mark").data(data).enter().append("circle").attr("class", "mark").attr("cx", function(d, i) {
            return x(d.timeStamp);
          }).attr("cy", function(d, i) {
            return y(d.elapsedTime);
          }).attr("r", 2.5).on("mouseover", showSample);
          graph.append("g").attr("class", "axis").call(yAxis);
          return graph.append("g").attr("class", "axis").attr("transform", "translate(0, " + height + ")").call(xAxis);
        });
      }

      return ResponseTimeScatterPlot;

    })();
  });

}).call(this);
