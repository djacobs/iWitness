IWitness.searchController = Ember.Object.create({
  searchAttempted:       false,
  contentBinding:        'IWitness.searchCriteria',
  searches:              [],
  servicesBeingSearched: new Ember.Set(),
  servicesWithResults:   new Ember.Set(),
  doingItLive:           false,

  flickrStatus: function(){
    return this._statusForService('flickr');
  }.property('servicesBeingSearched.length', 'servicesWithResults.length'),

  twitterStatus: function(){
    return this._statusForService('twitter');
  }.property('servicesBeingSearched.length', 'servicesWithResults.length'),

  search: function() {
    var self = this;
    this.set('searchAttempted', true);
    this.set('doingItLive', false);

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

  liveSearch: function() {
    var self = this;
    this.set('searchAttempted', true);
    this.set('doingItLive', true);

    if (this.getPath('content.isValid')) {
      IWitness.resultSetController.clearResults();
      this.get('servicesWithResults').clear();
      var params = this.get('content').searchParams();
      params.start = moment().subtract('days', 7);
      params.end = moment().add('days', 1);

      this._stopExecutingSearches();

      this.searches = [
        // new TwitterSearch(params),
        new FlickrSearch(params)
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
    search.fetch(100);
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
    if(this.get("doingItLive")){
      this._initializeLiveSearch(search);
    } else {
      this.get('servicesBeingSearched').remove(search.type);
    }
  },

  _initializeLiveSearch: function(staticSearch){
    // var search = new LiveTwitterSearch(_.extend(IWitness.searchCriteria.searchParams(), {sinceId: staticSearch.maxId}));
    staticSearch.startStreaming(30)
    // this.searches.push(search);
    // Ember.addListener(search, 'data', this, this._handleResults);
    // search.start(90);
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
