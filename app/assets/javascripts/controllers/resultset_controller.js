IWitness.ResultsetController = Ember.ArrayController.create({
  content: [],
  searching: false,

  pushTwitterResults: function(results){
    var objects = results.map(function(result) {
      return IWitness.TwitterResult.create(result)
    });
    this.pushObjects(objects);
  },

  search: function(params) {
    this.set('content', []);
    this.set('searching', true);

    var search = new TwitterSearch(params);
    var self   = this;

    search.bind('data', function(results){
      self.pushTwitterResults(results);
    });

    search.bind('done', function() {
      self.set('searching', false);
    });

    search.fetch(100);
  }
});
