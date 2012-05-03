function(doc) {
  var i, ev;
  if (doc.owa_stream_events) {
    for (i=0; i < doc.owa_stream_events.length; i++) {
      ev = doc.owa_stream_events[i];
      if (ev.target_url || ev.page_url) {
        emit([(ev.target_url || ev.page_url), ev.timestamp])
      }
    };
  } else if (doc.owa_target_url || doc.owa_page_url) {
    emit([(doc.owa_target_url || doc.owa_page_url), doc.owa_timestamp])
  }
};