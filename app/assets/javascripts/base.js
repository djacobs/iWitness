window.IWitness = Ember.Application.create({
  ready: function() {
    IWitness.routes.draw();
  }
});

IWitness.log = _.bind(Ember.Logger.log, Ember.Logger);
