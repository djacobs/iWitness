window.IWitness = Ember.Application.create({
  rootElement: "#container",

  body: function() {
    return $('#container, body');
  }.property(),

  ready: function() {
    if (this.isValidBrowser()) {
      IWitness.routes.draw();
      TwitterTimestampCache.expire();
      Analytics.startSession();
    }
  },

  isValidBrowser: function() {
    if ($.browser.webkit) {
      return true;
    } else {
      alert("Thanks for checking out iWitness. At this time, iWitness works only on WebKit-based browsers such as Google Chrome and Safari. Sorry for the inconvenience.");
      document.write('');
      return false;
    }
  }
});

IWitness.log = _.bind(Ember.Logger.log, Ember.Logger);

IWitness.config = _.extend({
  perPage: 100,
  pollInterval: 30, //seconds
  searchDelay: 3000,
  services: ['twitter', 'flickr'],
  minMapZoom: 9,
  maxMapZoom: 21
}, window['IWitnessConfig'] || {}); // allow specs to override these values.

timezoneJS.timezone.zoneFileBasePath = 'tzdata';
timezoneJS.timezone.init();
IWitness.Templates = {};
