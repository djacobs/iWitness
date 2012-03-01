var Analytics = {
  track: function(category, action, label, value) {
    if (arguments.length == 3) value = parseFloat(value, 10);

    _.defer(function() {
      _gaq.push(['_trackEvent', category, action, label, value]);
    });
  }
}
