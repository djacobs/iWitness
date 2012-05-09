IWitness.criteriaController = Ember.Object.create({
  contentBinding: 'IWitness.criteria',

  initiateSearch: function() {
    this._resetSearch();
    this._executeSearch();

  }.observes('content.zoom', 'content.center', 'content.northEast', 'content.southWest', 'content.radius',
             'content.stream', 'content.keyword', 'content.rawStart', 'content.rawEnd', 'IWitness.spaceTime.isLoaded'),

  _executeSearch: _.debounce( function() {
    Ember.run.sync();

    if (this.getPath('content.isValid') && IWitness.spaceTime.get('isLoaded')) {
      IWitness.resultSetController.resume();
      IWitness.searchController.search(this.get('content').getParams());
    }
  }, IWitness.config.searchDelay),

  _resetSearch: _.throttle( function() {
    IWitness.resultSetController.clearResults();
    IWitness.searchController.reset();
  }, IWitness.config.searchDelay),

  useLocalTime: function(value) {
    if (value == "toggle") {
      this.get('content').toggleProperty('useLocalTime');
    } else if (this.getPath('content.useLocalTime') !== value) {
      this.setPath('content.useLocalTime', value);
    } else {
      return; // don't need to change anything. short-circuit the search
    }

    if (this.getPath("content.timezoneDifference") !== 0) {
      this.initiateSearch();
    }
  }

});
