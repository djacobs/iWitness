window.IWitness = Ember.Application.create({
  ready: function() {
    IWitness.routes.draw();
  }
});

IWitness.log = _.bind(Ember.Logger.log, Ember.Logger);

IWitness.config = {
  perPage: 10,
  pollInterval: 30, //seconds
  searchDelay: 3000
};
