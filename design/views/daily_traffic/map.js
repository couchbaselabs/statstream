function(doc) {
  if (doc.server_timestamp) {
    var date = new Date(doc.server_timestamp)
    var key = [date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()];
    emit(key)
  }
};