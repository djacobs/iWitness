IWitness.searchController = Ember.Object.create({
  searching:         false,
  searchAttempted:   false,
  contentBinding:    'IWitness.searchCriteria',
  activeSearches:    new Ember.Set(),

  searchMessage: function() {
    return this.get('activeSearches').map(function(searchType) {
      return 'searching ' + searchType + '...';
    }).join(' ');
  }.property('activeSearches.length'),

  search: function() {
    this.set('searchAttempted', true);

    if (this.getPath('content.isValid')) {
      this.set('searching', true);
      IWitness.resultSetController.clearResults();

      var params = this.get('content').searchParams();
      var flickrSearch = new FlickrSearch(params);
      var twitterSearch = new TwitterSearch(params);
      this.searchService(new FlickrSearch(params));
      this.searchService(new TwitterSearch(params));
    }
  },

  searchService: function(search){
    this.get('activeSearches').add(search.type);
    search.bind('data', this.handleResults.bind(this));
    search.bind('done', this.searchServiceIsDone.bind(this));
    search.fetch(100);
  },

  handleResults: function(type, results){
    IWitness.resultSetController.pushResults(type, results);
  },

  searchServiceIsDone: function(type) {
    this.get('activeSearches').remove(type);
    if (this.get('activeSearches').length === 0) {
      this.set('searching', false);
    }
  }
});
