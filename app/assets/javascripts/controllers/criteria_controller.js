IWitness.criteriaController = Ember.Object.create({
  contentBinding:        'IWitness.criteria',

  initiateSearch: function() {
    IWitness.searchController.set('searchAttempted', true);

    // TODO: cross controller calls
    IWitness.searchController._stopExecutingSearches();
    IWitness.resultSetController.clearResults();
    // TODO: not in this model anymore
    IWitness.searchController.get('servicesWithResults').clear();

    console.log('initiateSearch');
    this.changeUrl();
  }.observes('content.stream'),

  changeUrl: _.debounce( function() {
    console.log('running');
    Ember.run.sync();

    if (this.getPath('content.isValid')) {
      console.log('valid');
      if (this.getPath('content.stream')) {
        IWitness.routes.visitStream(this.get('content'));
      } else {
        IWitness.routes.visitSearch(this.get('content'));
      }
    }
  }, 3000),

  stopSearch: function(){
    // TODO: cross controller calls
    IWitness.searchController._stopExecutingSearches();
  }.observes('content.stream')



});
