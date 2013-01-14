(function() {

  define(["jquery", "d3", "moment"], function($, d3, moment) {
    var ResponseTimeScatterPlot;
    return ResponseTimeScatterPlot = (function() {

      function ResponseTimeScatterPlot(elem, url, markSize) {
        this.elem = elem;
        this.url = url;
        this.markSize = markSize;
        this.height = this.elem.height();
        this.width = this.elem.width();
      }

      ResponseTimeScatterPlot.prototype.update = function() {
        var _this = this;
        return $.getJSON(this.url, function(data) {
          var graph, marks, sample, sampleFormatter, showSample, x, xAxis, y, yAxis;
          sampleFormatter = function(d) {
            d.elapsedTimeStr = d.elapsedTime.toFixed(3);
            return d;
          };
          $(".tops .response-time").render(data.samples.map(sampleFormatter), {
            label: {
              href: function() {
                return this.label;
              }
            }
          });
          x = d3.scale.linear().domain([
            d3.min(data.samples, function(d) {
              return d.timeSinceStart;
            }), d3.max(data.samples, function(d) {
              return d.timeSinceStart;
            })
          ]).range([0, _this.width]).nice();
          y = d3.scale.sqrt().domain([0, Math.max(data.maxElapsedTimeInBuild)]).range([_this.height, 0]).nice();
          sample = $('.report .sample');
          showSample = function(d) {
            var date;
            date = moment.unix(d.timeStamp).format("D.M.YYYY HH:mm:ss");
            sample.find('.timeStamp').text("" + date);
            sample.find('.elapsedTime').text("" + d.elapsedTimeStr + " s");
            sample.find('.responseCode').text(d.responseCode);
            sample.find('.bytes').text("" + d.bytes + " B");
            return sample.find('.label').text(d.label).attr("href", d.label);
          };
          xAxis = d3.svg.axis().scale(x).ticks(6);
          yAxis = d3.svg.axis().scale(y).orient("left").ticks(6);
          graph = d3.select(_this.elem[0]);
          graph.selectAll(".axis").remove();
          graph.append("g").attr("class", "axis").call(yAxis);
          graph.append("g").attr("class", "axis").attr("transform", "translate(0, " + _this.height + ")").call(xAxis);
          marks = graph.selectAll(".mark").data(data.samples).attr("class", function(d) {
            if (d.failed) {
              return "mark failed";
            } else {
              return "mark passed";
            }
          }).attr("cx", function(d) {
            return x(d.timeSinceStart);
          }).attr("cy", function(d) {
            return y(d.elapsedTime);
          });
          marks.enter().append("circle").attr("class", function(d) {
            if (d.failed) {
              return "mark failed";
            } else {
              return "mark passed";
            }
          }).attr("cx", function(d) {
            return x(d.timeSinceStart);
          }).attr("cy", function(d) {
            return y(d.elapsedTime);
          }).attr("r", _this.markSize).on("mouseover", showSample);
          return marks.exit().remove();
        });
      };

      return ResponseTimeScatterPlot;

    })();
  });

}).call(this);
