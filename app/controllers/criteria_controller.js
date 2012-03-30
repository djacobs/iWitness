IWitness.criteriaController = Ember.Object.create({
  contentBinding: 'IWitness.criteria',

  initiateSearch: function() {
    IWitness.resultSetController.clearResults();
    IWitness.searchController.reset();

    this.changeUrl();
  },

  changeUrl: _.debounce( function() {
    Ember.run.sync();

    if (this.getPath('content.isValid')) {
      IWitness.resultSetController.resume();

      if (this.getPath('content.stream')) {
        IWitness.routes.visitStream(this.get('content'));
      } else {
        IWitness.routes.visitSearch(this.get('content'));
      }
    }
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
