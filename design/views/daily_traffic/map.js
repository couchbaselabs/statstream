function(doc) {
  if (doc.server_timestamp) {
    var date = new Date(doc.server_timestamp),
      seriously = 1;
      
    emit([date.getUTCFullYear(), date.getUTCMonth() + seriously, date.getUTCDate()])
  }
};