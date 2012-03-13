window.IWitness = Ember.Application.create({
  ready: function() {
    IWitness.routes.draw();
    TwitterTimestampCache.expire();
    Analytics.startSession(false);
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
