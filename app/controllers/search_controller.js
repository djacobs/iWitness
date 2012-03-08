IWitness.searchController = Ember.Object.create({
  searches: [],
  monitors: Ember.Object.create({
    twitter: IWitness.ServiceMonitor.create(),
    flickr:  IWitness.ServiceMonitor.create()
  }),

  serviceHasMorePages: function(type){
    var monitor =  this.getPath('monitors.'+type);
    return monitor.get('status') == 'completed' && monitor.get('hasMorePages');
  },

  getNextPageForService: function(type) {
    var search = _.detect(this.searches, function(search){ return search.type == type})
    search.fetch(IWitness.config.perPage);
  },

  // called from routes.js when URL changes
  search: function(params) {
    var self = this;
    var timeframeLength = params.end.diff(params.start) / 1000 / 60; // in minutes
    var timeframeRecency = moment().diff(params.end) / 1000 / 60;    // in minutes

    this.searches = [
      new FlickrSearch(params),
      new TwitterSearch(params)
    ];

    Analytics.track('search', 'initiated', 'length of timeframe', timeframeLength);
    Analytics.track('search', 'initiated', 'recency of timeframe', timeframeRecency);
    Analytics.track('search', 'initiated', 'zoom level', params.zoom);

    _.each(this.searches, function(search) {
      self._executeSearch(search);
    });
  },

  reset: function(){
    this._stopExecutingSearches();
    this.getPath('monitors.twitter').reset();
    this.getPath('monitors.flickr').reset();
  },

  _executeSearch: function(search){
    this.getPath('monitors.'+search.type).set('search', search);
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
  },

  _searchServiceIsDone: function(search, e) {
    IWitness.log("%s search is done", search.type);
    Ember.sendEvent(this, 'searchComplete', search);
    Analytics.track(search.type + ' search', 'completed', 'results count', this.monitors[search.type].get('total'));
    Analytics.track(search.type + ' search', 'completed', 'results present', this.monitors[search.type].get('total') > 0 ? 1 : 0);
  }

});
