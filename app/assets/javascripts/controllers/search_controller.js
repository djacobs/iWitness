IWitness.searchController = Ember.Object.create({
  searching:         false,
  searchSubmitted:   false,
  contentBinding:    'IWitness.searchCriteria',

  search: function() {
    this.set('searchSubmitted', true);

    if (!this.getPath('content.isValid')) return;

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
  },

  createMarkerForResult: function(result) {
    var position = new google.maps.LatLng(result.getPath('geo.coordinates')[0], result.getPath('geo.coordinates')[1]);

    if (this.get('marker')) {
      this.get('marker').setPosition(position);
    } else {
      this.set('marker', new google.maps.Marker({position: position, map: this.map}));
    }
  }
});
