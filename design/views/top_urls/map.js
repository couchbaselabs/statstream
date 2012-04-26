function(doc) {
  if (doc.owa_target_url || doc.owa_page_url) {
    emit(doc.owa_target_url || doc.owa_page_url)
  }
};