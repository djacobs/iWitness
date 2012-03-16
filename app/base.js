window.IWitness = Ember.Application.create({
  ready: function() {
    if (this.isValidBrowser()) {
      IWitness.routes.draw();
      TwitterTimestampCache.expire();
      Analytics.startSession(false);
    }
  },

  isValidBrowser: function() {
    if ($.browser.webkit) {
      return true;
    } else {
      alert("iWitness is currently in beta and does not yet support your browser.\n\n" +
            "Please download Google Chrome to use iWitness.");
      document.write('');
      return false;
    }
  }
});

IWitness.log = _.bind(Ember.Logger.log, Ember.Logger);

IWitness.config = {
  perPage: 100,
  pollInterval: 30, //seconds
  searchDelay: 3000
};

window.onbeforeunload = function() {
  Analytics.stopSession();
}

timezoneJS.timezone.zoneFileBasePath = '/tzdata';
timezoneJS.timezone.init();
