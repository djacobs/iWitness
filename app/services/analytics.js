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
    console.log("Session started!");
    var wait = (stream ? 10 : 3) * 1 * 1000;
    if(this.session) {
      this._resetSession(wait);
    } else {
      this.session = true;
      console.log("Session = ", this.session);
      // this.track('session', 'started', 'sessionCount', this.sessionCount++);
      console.log("reported event to Google Analytics.");
      this._resetSession(wait);
    }
  },

  _resetSession: _variableDebounce( function() {
    this.session = false;
    console.log("Session = ", this.session);
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
    console.log("Waiting ", newWait);
    timeout = setTimeout(later, newWait);
  };
}
