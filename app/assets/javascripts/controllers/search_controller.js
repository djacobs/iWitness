IWitness.searchController = Ember.Object.create({
  searchAttempted:       false,
  contentBinding:        'IWitness.searchCriteria',
  searches:              [],
  servicesBeingSearched: new Ember.Set(),
  servicesWithResults:   new Ember.Set(),

  flickrStatus: function(){
    return this._statusForService('flickr');
  }.property('servicesBeingSearched.length', 'servicesWithResults.length'),

  twitterStatus: function(){
    return this._statusForService('twitter');
  }.property('servicesBeingSearched.length', 'servicesWithResults.length'),

  serviceHasMorePages: function(type){
    var search = _.detect(this.searches, function(search){ return search.type == type})
    return search && this.get(type+'Status') != 'searching' && search.hasMorePages();
  },

  stopSearch: function(){
    this._stopExecutingSearches();
  }.observes('content.stream'),

  search: function() {
    var self = this;
    this.set('searchAttempted', true);

    if (this.getPath('content.isValid')) {
      IWitness.resultSetController.clearResults();
      this.get('servicesWithResults').clear();
      var params = this.get('content').searchParams();

      this._stopExecutingSearches();

      this.searches = [
        new FlickrSearch(params),
        new TwitterSearch(params)
      ];

      _.each(this.searches, function(search) {
        self._executeSearch(search);
      });
    }
  },

  _executeSearch: function(search){
    this.get('servicesBeingSearched').add(search.type);
    Ember.addListener(search, 'data', this, this._handleResults);
    Ember.addListener(search, 'done', this, this._searchServiceIsDone);
    search.fetch(IWitness.config.perPage);
  },

  _stopExecutingSearches: function(){
    _.each(this.searches, function(search) {
      search.stop();
      Ember.removeListener(search, 'data', this, this._handleResults);
      Ember.removeListener(search, 'done', this, this._searchServiceIsDone);
    });
  },

  _handleResults: function(search, e, results){
    IWitness.resultSetController.pushResults(search.type, results);
    if (results.length) this.get('servicesWithResults').add(search.type);
  },

  _searchServiceIsDone: function(search, e) {
    IWitness.log("%s search is done", search.type);
    this.get('servicesBeingSearched').remove(search.type);
    Ember.sendEvent(this, 'searchComplete', search);
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
