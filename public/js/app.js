$(function() {
  // get the view data for top urls
  // print it to the screen
  $('#daily-pageviews').autoview({
    query : ["view", "daily_traffic", {group_level : 3}],
    template : Mustache.compile($('#array-keys-values').html())
  })
  
  $('#top-pages').autoview({
    query : ["view", "top_urls", {group : true}],
    template : Mustache.compile($('#keys-values').html())
  })
});