function(doc) {
  var i, ev;
  if (!doc.owa_site_id) return;
  if (doc.owa_stream_events) {
    for (i=0; i < doc.owa_stream_events.length; i++) {
      ev = doc.owa_stream_events[i];
      if (ev.timestamp) {
        emit([doc.owa_site_id, ev.timestamp])
      }
    };
  } else if (doc.owa_timestamp) {
    emit([doc.owa_site_id, doc.owa_timestamp])
  }
};
