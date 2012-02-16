IWitness.resultSetController = Ember.ArrayController.create({
  content: [],
  selectedResult: null,

  pushResults: function(type, results){
    var objects = results.map(function(result) {
      return IWitness.resultFactory.create(type, result);
    });
    this.pushObjects(objects);
  },

  clearResults: function() {
    this.set('content', []);
    this.set('selectedResult', null);
  }
});
