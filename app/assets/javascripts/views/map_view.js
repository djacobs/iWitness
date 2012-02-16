IWitness.MapView = Ember.View.extend({
  modelBinding: 'IWitness.searchController.content',
  selectedResultBinding: 'IWitness.resultSetController.selectedResult',

  didInsertElement: function() {
    this.map = new Map(document.getElementById("map"), 34.043127, -118.266953); // LA
    // this.map = new Map(document.getElementById("map"), 40.772742,-73.972321); // NY
    this.map.bind('bounds_changed', _.debounce(this.mapUpdate, 100).bind(this));
  },

  mapUpdate: function() {
    this.setPath('model.center', this.map.getCenter());
    this.setPath('model.northEast', this.map.getNorthEast());
    this.setPath('model.southWest', this.map.getSouthWest());
  },

  createMarkerForResult: function() {
    var lat = this.getPath('selectedResult.lat');
    var lng = this.getPath('selectedResult.lng');
    if(lat && lng) this.map.moveMarkerTo(lat, lng);
  }.observes('selectedResult')
});
