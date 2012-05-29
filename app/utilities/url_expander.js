IWitness.URLExpander = {
  expand: function(text, urls) {
    _(urls).each(function(urlData) {
      text = text.replace(urlData.url, urlData.expanded_url);
    });
    return text;
  }
};
