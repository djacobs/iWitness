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
    Ember.addListener(search, 'data', this, this._handleResults);
    Ember.addListener(search, 'done', this, this._searchServiceIsDone);
    search.fetch(100);
  },

  _handleResults: function(search, e, results){
    IWitness.resultSetController.pushResults(search.type, results);
    if (results.length) this.get('servicesWithResults').add(search.type);
  },

  _searchServiceIsDone: function(search, e) {
    this.get('servicesBeingSearched').remove(search.type);
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
