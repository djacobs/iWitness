IWitness.criteriaController = Ember.Object.create({
  contentBinding: 'IWitness.criteria',

  initiateSearch: function() {
    IWitness.searchController.stop();
    IWitness.resultSetController.clearResults();

    console.log('initiateSearch');
    this.changeUrl();

  }.observes('content.stream'),

  changeUrl: _.debounce( function() {
    console.log('running debounced changeUrl');
    Ember.run.sync();

    if (this.getPath('content.isValid')) {
      console.log('valid! commencing search!');
      if (this.getPath('content.stream')) {
        IWitness.routes.visitStream(this.get('content'));
      } else {
        IWitness.routes.visitSearch(this.get('content'));
      }
    }
  }, 3000)

});
