IWitness.resultSetController = Ember.ArrayController.create({
  content: [],
  selectedResult: null,

  pushTwitterResults: function(results){
    var objects = results.map(function(result) {
      return IWitness.TwitterResult.import(result)
    });
    this.pushObjects(objects);
  },

  clearResults: function() {
    this.set('content', []);
    this.set('selectedResult', null);
  }
});
