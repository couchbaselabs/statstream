$(function() {
  // get the view data for top urls
  // print it to the screen
  $('#daily-pageviews').autoview({
    query : ["view", "daily_traffic", {group_level : 3}],
    template : Mustache.compile($('#array-keys-values').html())
  })
  
  coux(["view", "top_urls", {group : true}], function(err, view) {
    view.rows = view.rows.sort(function(a, b) {return b.value - a.value});
    $('#top-pages').html(Mustache.render($('#keys-values').html(), view))
  })
  
  var context = cubism.context()
  .step(5e3)
  .size(800);

  d3.select("#cubism").selectAll(".axis")
  .data(["top"])
  .enter().append("div")
  .attr("class", function(d) { return d + " axis"; })
  .each(function(d) { d3.select(this).call(context.axis().ticks(8).orient(d)); });

  d3.select("#cubism").append("div")
  .attr("class", "rule")
  .call(context.rule());

  d3.select("#cubism").selectAll(".horizon")
  .data([metric("events")])
  .enter().insert("div", ".bottom")
  .attr("class", "horizon")
  .call(context.horizon().extent([0, 50]).height(100));

  context.on("focus", function(i) {
    d3.selectAll(".value").style("right", i == null ? null : context.size() - i + "px");
  });

  // Replace this with context.graphite and graphite.metric!
  function metric(name) {
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

        var times, gap, i, j, val = 0; vals = []; rows = view.rows;
        for (i=0; i < rows.length; i++) {
          if (rows[i].key < start + step) {
            val += rows[i].value;
          } else if (rows[i].key > start + step) {
            // console.log("val", val)
            vals.push(val);
            gap = rows[i].key - start + step;
            times = gap / step;
            // console.log("times", times, start, gap, step, rows[i])
            for (j=0; j < times; j++) {
              vals.push(NaN) // nothing for that window
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
        // console.log("vals", vals)
        callback(null, vals);
      });
      }, name);
    }


});