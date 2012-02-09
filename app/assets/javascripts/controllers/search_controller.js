IWitness.searchController = Ember.Object.create({
  searching:         false,
  searchSubmitted:   false,
  contentBinding:    'IWitness.searchCriteria',
  isValidBinding:    'content.isValid',
  keywordBinding:    'content.keyword',
  start_dateBinding: 'content.start_date',
  start_timeBinding: 'content.start_time',
  end_dateBinding:   'content.end_date',
  end_timeBinding:   'content.end_time',
  radiusBinding:     'content.radius',
  errorsBinding:     'content.errors',

  search: function() {
    this.set('searchSubmitted', true);

    if (!this.get('isValid')) return;

    IWitness.resultSetController.set('content', []);
    this.set('searching', true);

    var params = IWitness.searchCriteria.searchParams();
    var search = new TwitterSearch(params);
    var self   = this;

    search.bind('data', function(results){
      IWitness.resultSetController.pushTwitterResults(results);
    });

    search.bind('done', function() {
      self.set('searching', false);
    });

    search.fetch(100);
  }
});
