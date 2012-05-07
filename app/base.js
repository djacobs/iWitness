window.IWitness = Ember.Application.create({
  rootElement: "#container",

  ready: function() {
    if (this.isValidBrowser()) {
      IWitness.routes.draw();
      TwitterTimestampCache.expire();
      Analytics.startSession();
      this.trackCurrentTime();
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
  },

  trackCurrentTime: function() {
    var self = this;
    self.set('currentTime', moment().format('HH:mm A'));

    setInterval(function() {
      self.set('currentTime', moment().format('HH:mm A'));
    }, 1000);
  }

});

IWitness.log = _.bind(Ember.Logger.log, Ember.Logger);

IWitness.config = _.extend({
  perPage: 100,
  pollInterval: 30, //seconds
  searchDelay: 3000,
  services: ['twitter', 'flickr']
}, window['IWitnessConfig'] || {}); // allow specs to override these values.

timezoneJS.timezone.zoneFileBasePath = 'tzdata';
timezoneJS.timezone.init();
