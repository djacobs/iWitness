var Analytics = Ember.Object.create({
  track: function(category, action, label, value) {
    if (arguments.length == 3) value = parseFloat(value, 10);

    _.defer(function() {
      _gaq.push(['_trackEvent', category, action, label, value]);
    });
  },

  startSession: function() {
    this.session = true;
    this.track('session', 'started', 'started');
    IWitness.log('session started');
  },

  extendSession: function(streamOrSearch) {
    var wait = (streamOrSearch == 'stream' ? 10 : 3) * 60 * 1000;

    if (!this.session) this.startSession();

    this._resetSession(wait);
  },

  _stopSession: function() {
    this.session = false;
    IWitness.log('session expired');
  },

  _resetSession: _variableDebounce(function() {
    this._stopSession();
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
