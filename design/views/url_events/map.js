function(doc) {
  var i, ev;
  function tail(string) {return string.split('#').pop()};
  if (doc.owa_stream_events) {
    for (i=0; i < doc.owa_stream_events.length; i++) {
      ev = doc.owa_stream_events[i];
      if (ev.target_url || ev.page_url || doc.owa_target_url || doc.owa_page_url) {
        emit([tail(ev.target_url || ev.page_url || doc.owa_target_url || doc.owa_page_url), ev.timestamp])
      }
    };
  } else if (doc.owa_target_url || doc.owa_page_url) {
    emit([tail(doc.owa_target_url || doc.owa_page_url), doc.owa_timestamp])
  }
};
