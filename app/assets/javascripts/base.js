window.IWitness = Ember.Application.create({
  ready: function() {
    IWitness.routes.draw();
    this.set('criteria', IWitness.Criteria.create());
  }
});

IWitness.log = _.bind(Ember.Logger.log, Ember.Logger);

IWitness.config = {
  perPage: 100,
  pollInterval: 30, //seconds
  searchDelay: 3000
};
