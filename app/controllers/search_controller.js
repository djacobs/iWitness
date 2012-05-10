IWitness.searchController = Ember.Object.create({
  searches: [],

  init: function() {
    this._super();
    var monitors = Ember.Object.create();

    IWitness.config.services.forEach(function(service) {
      monitors.set(service, IWitness.ServiceMonitor.create());
    });

    this.set('monitors', monitors);
  },

  serviceHasMorePages: function(type){
    var monitor =  this.getPath('monitors.'+type);
    return monitor.get('status') == 'completed' && monitor.get('hasMorePages');
  },

  getNextPageForService: function(type) {
    var search = this.get('searches').find( function(search){ return search.type == type});
    search.fetch(IWitness.config.perPage);
  },

  search: function(params) {
    var self = this;

    this.set('searches', IWitness.config.services.map(function(service) {
      var className = service.replace(/^(.)/, function(m, chr) { return chr.toUpperCase() }) + 'Search';
      return new window[className](params);
    }));

    this.get('searches').forEach( function(search) {
      self._executeSearch(search);
    });
  },

  reset: function(){
    this._stopExecutingSearches();
    var self = this;
    IWitness.config.services.forEach(function(service) {
      self.getPath('monitors.' + service).reset();
    });
  },

  _executeSearch: function(search){
    this.getPath('monitors.'+search.type).set('search', search);
    Ember.addListener(search, 'data', this, this._handleResults);
    Ember.addListener(search, 'done', this, this._searchServiceIsDone);
    search.fetch(IWitness.config.perPage);
  },

  _stopExecutingSearches: function(){
    this.get('searches').forEach( function(search) {
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
  }

});
