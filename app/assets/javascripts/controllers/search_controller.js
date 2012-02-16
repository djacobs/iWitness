IWitness.searchController = Ember.Object.create({
  searching:         false,
  searchAttempted:   false,
  contentBinding:    'IWitness.searchCriteria',

  search: function() {
    this.set('searchAttempted', true);

    if (this.getPath('content.isValid')) {
      this.set('searching', true);
      IWitness.resultSetController.clearResults();

      var params = this.get('content').searchParams();
      var search = new FlickrSearch(params);

      search.bind('data', this.handleResults.bind(this, 'FlickrResult'));
      search.bind('done', this.searchServiceIsDone.bind(this));
      search.fetch(100);
    }
  },

  handleResults: function(resultType, results){
    IWitness.resultSetController.pushResults(resultType, results);
  },

  searchServiceIsDone: function() {
    this.set('searching', false);
  }
});
