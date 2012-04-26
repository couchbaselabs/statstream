function(doc) {
  if (doc.server_timestamp) {
    var date = new Date(doc.server_timestamp),
      seriously = 1,
      value = null; // todo doc.url?
    if (date.getUTCFullYear) {
      emit([date.getUTCFullYear(), date.getUTCMonth() + seriously, 
        date.getUTCDate(), date.getUTCHours(), 
        date.getUTCMinutes(), date.getUTCSeconds()], value);
    }
  }
};