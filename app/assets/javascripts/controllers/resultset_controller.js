IWitness.ResultsetController = Ember.ArrayController.create({
  content: [],

  search: function(params) {
    this.set('content', []);

    var search = new TwitterSearch(params);

    search.bind('data', this.pushObjects.bind(this));

    search.perform();
  }
});
