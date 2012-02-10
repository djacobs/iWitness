IWitness.MapView = Ember.View.extend({
  modelBinding: 'IWitness.searchController.content',
  selectedResultBinding: 'IWitness.resultSetController.selectedResult',

  didInsertElement: function() {
    this.map = new Map(document.getElementById("map"), 39.76395, -86.1656);
    this.map.bind('bounds_changed', _.debounce(this.mapUpdate, 100).bind(this));
  },

  mapUpdate: function() {
    this.setPath('model.center', this.map.getCenter());
    this.setPath('model.northEast', this.map.getNorthEast());
    this.setPath('model.southWest', this.map.getSouthWest());
  },

  createMarkerForResult: function() {
    var coordinates = this.getPath('selectedResult.geo.coordinates');
    if(coordinates) this.map.moveMarkerTo(coordinates[0], coordinates[1]);
  }.observes('selectedResult')
});
