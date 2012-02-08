IWitness.ResultsetController = Ember.ArrayController.create({
  content: [],
  searching: false,

  search: function(params) {
    this.set('content', []);
    this.set('searching', true);

    var search = new TwitterSearch(params);
    var self   = this;

    search.bind('data', function(results){
      results = results.map(function(result) {
        return IWitness.TwitterResult.create(result)
      });
      self.pushObjects(results);
    });

    search.bind('done', function() {
      self.set('searching', false);
    });

    search.perform();
  }
});
