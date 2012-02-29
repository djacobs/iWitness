IWitness.criteriaController = Ember.Object.create({
  contentBinding: 'IWitness.criteria',

  initiateSearch: function() {
    IWitness.resultSetController.clearResults();

    Ember.run.sync();
    if (this.getPath('content.isValid')) {
      IWitness.searchController.reset();
      this.changeUrl();
    }
  },

  changeUrl: _.debounce( function() {
    Ember.run.sync();

    if (this.getPath('content.isValid')) {
      IWitness.resultSetController.unpause();

      if (this.getPath('content.stream')) {
        IWitness.routes.visitStream(this.get('content'));
      } else {
        IWitness.routes.visitSearch(this.get('content'));
      }
    }
  }, IWitness.config.searchDelay)

});
