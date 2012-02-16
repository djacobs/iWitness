IWitness.resultSetController = Ember.ArrayController.create({
  content: [],
  selectedResult: null,

  pushResults: function(resultType, results){
    var objects = results.map(function(result) {
      return IWitness[resultType].import(result)
    });
    this.pushObjects(objects);
  },

  clearResults: function() {
    this.set('content', []);
    this.set('selectedResult', null);
  }
});
