function(doc) {
  var i, ev;
  if (doc.owa_stream_events) {
    for (i=0; i < doc.owa_stream_events.length; i++) {
      ev = doc.owa_stream_events[i];
      if (ev.timestamp) {
        emit(ev.timestamp)
      }
    };
  } else if (doc.owa_target_url || doc.owa_page_url) {
    emit(doc.owa_timestamp)
  }
};