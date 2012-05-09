$(function() {
  // get the view data for top urls
  // print it to the screen
  $('#daily-pageviews').autoview({
    query : ["view", "daily_traffic", {group_level : 3}],
    template : Mustache.compile($('#array-keys-values').html())
  })
  
  coux(["view", "url_events", {group_level : 1}], function(err, view) {
    view.rows = view.rows.sort(function(a, b) {return b.value - a.value});
    $('#top-pages').html(Mustache.render($('#keys-values').html(), view));
    
    var top10 = [];
    for (var i=0; i < 10; i++) {
      top10.push(view.rows[i].key[0])
    };
    
    var context = cubism.context()
    .step(1e6)
    .size(1000);

    d3.select("#cubism").selectAll(".axis")
    .data(["top", "bottom"])
    .enter().append("div")
    .attr("class", function(d) { return d + " axis"; })
    .each(function(d) { d3.select(this).call(context.axis().ticks(8).orient(d)); });

    d3.select("#cubism").append("div")
    .attr("class", "rule")
    .call(context.rule());

    d3.select("#cubism").selectAll(".horizon")
    .data([allEvents("events")].concat(top10.map(urlEvents)))
    .enter().insert("div", ".bottom")
    .attr("class", "horizon")
    .call(context.horizon().height(50));

    context.on("focus", function(i) {
      d3.selectAll(".value").style("right", i == null ? null : context.size() - i + "px");
    });

    function urlEvents(url) {
      return context.metric(function(start, stop, step, callback) {
        start = (+start)/1000, stop = (+stop)/1000, step = (+step)/1000;
        coux(["view", "url_events", {
          startkey : [url, start],
          endkey : [url, stop],
          group_level : 2
        }], function(err, view) {
          if (err) {
            return callback(err);
          }
          var bins = binRows(view.rows, start, step, function(k) {return k[1]});
          callback(null, bins);
        });
        }, url);
    };


    function allEvents(name) {
      return context.metric(function(start, stop, step, callback) {
        start = (+start)/1000, stop = (+stop)/1000, step = (+step)/1000;
        coux(["view", "events", {
          startkey : start,
          endkey : stop,
          group : true
        }], function(err, view) {
          if (err) {
            return callback(err);
          }
          callback(null, binRows(view.rows, start, step));
        });
        }, name);
      }
    
  })
  


    function binRows(rows, start, step, keyTimeFun) {
      var times, gap, i, j, val = 0, vals = [];
      keyTimeFun = keyTimeFun || function(x) {return x};
      for (i=0; i < rows.length; i++) {
        rowTime = keyTimeFun(rows[i].key);
        if (rowTime < start + step) {
          val += rows[i].value;
        } else if (rowTime > start + step) {
          // console.log("val", val)
          vals.push(val);
          gap = rowTime - start + step;
          times = gap / step;
          // console.log("times", times, start, gap, step, rows[i])
          for (j=0; j < times; j++) {
            vals.push(NaN) // nothing for that bin
          };
          val = rows[i].value;
          start += (step * (times+1));
        } else {
          // console.log("val", val)
          vals.push(val);
          val = rows[i].value;
          start += step;
        }
      };
      return vals;
    }

});