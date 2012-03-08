var Analytics = Ember.Object.create({
  session: false,
  sessionCount: 0,

  track: function(category, action, label, value) {
    if (arguments.length == 3) value = parseFloat(value, 10);

    _.defer(function() {
      _gaq.push(['_trackEvent', category, action, label, value]);
    });
  },

  startSession: function(stream) {
    var wait = (stream ? 10 : 3) * 60 * 1000;
    if(this.session) {
      this._resetSession(wait);
    } else {
      this.session = true;
      this.track('session', 'started', 'sessionCount', this.sessionCount++);
      this._resetSession(wait);
    }
  },

  _resetSession: _variableDebounce( function() {
    this.session = false;
  })

});

// modified debounce function from underscore.js to allow for a changing wait time.
function _variableDebounce(func) {
  var timeout;
  return function(newWait) {
    var context = this, args = Array.prototype.slice.call(arguments, 1);
    var later = function() {
      timeout = null;
      func.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, newWait);
  };
}
