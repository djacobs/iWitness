IWitness.resultSetController = Ember.ArrayController.create({
  content: [],
  selectedResult: null,
  servicesWithResults: new Ember.Set(),

  pushResults: function(type, results){
    var objects = results.map(function(result) {
      return IWitness.resultFactory.create(type, result);
    });
    this.pushObjects(objects);
    if (objects.length) this.get('servicesWithResults').add(type);
  },

  clearResults: function() {
    this.set('content', []);
    this.get('servicesWithResults').clear();
    this.set('selectedResult', null);
  },

  hasResultsFor: function(type) {
    return this.get('servicesWithResults').contains(type);
  }
});
