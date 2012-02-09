IWitness.resultSetController = Ember.ArrayController.create({
  content: [],

  pushTwitterResults: function(results){
    var objects = results.map(function(result) {
      return IWitness.TwitterResult.create(result)
    });
    this.pushObjects(objects);
  }
});
