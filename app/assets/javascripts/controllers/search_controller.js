IWitness.searchController = Ember.Object.create({
  searchAttempted:       false,
  contentBinding:        'IWitness.searchCriteria',
  servicesBeingSearched: new Ember.Set(),
  servicesWithResults:   new Ember.Set(),

  flickrStatus: function(){
    return this._statusForService('flickr');
  }.property('servicesBeingSearched.length', 'servicesWithResults.length'),

  twitterStatus: function(){
    return this._statusForService('twitter');
  }.property('servicesBeingSearched.length', 'servicesWithResults.length'),

  search: function() {
    this.set('searchAttempted', true);

    if (this.getPath('content.isValid')) {
      IWitness.resultSetController.clearResults();
      this.get('servicesWithResults').clear();
      var params = this.get('content').searchParams();
      this._searchService(new FlickrSearch(params));
      this._searchService(new TwitterSearch(params));
    }
  },

  _searchService: function(search){
    this.get('servicesBeingSearched').add(search.type);
    search.bind('data', _.bind(this._handleResults, this));
    search.bind('done', _.bind(this._searchServiceIsDone, this));
    search.fetch(100);
  },

  _handleResults: function(type, results){
    IWitness.resultSetController.pushResults(type, results);
    if (results.length) this.get('servicesWithResults').add(type);
  },

  _searchServiceIsDone: function(type) {
    this.get('servicesBeingSearched').remove(type);
  },

  _statusForService: function(type) {
    if (this._isSearchingService(type)) {
      return 'searching';
    } else if (this._hasResultsFor(type)) {
      return 'completed';
    } else {
      return 'no results';
    }
  },

  _hasResultsFor: function(type) {
    return this.get('servicesWithResults').contains(type);
  },

  _isSearchingService: function(type) {
    return this.get('servicesBeingSearched').contains(type);
  }
});
