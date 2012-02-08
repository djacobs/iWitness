IWitness.ResultsetController = Ember.ArrayController.create({
  content: [],

  search: function(params) {
    this.set('content', []);

    var search = new TwitterSearch(params);
    var self   = this;

    search.bind('data', function(results){
      results = results.map(function(result) {
        return IWitness.TwitterResult.create(result)
      });
      self.pushObjects(results);
    });

    search.perform();
  }
});
