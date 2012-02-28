IWitness.MapView = Ember.View.extend({
  templateName:          'map_template',
  modelBinding:          'IWitness.criteriaController.content',
  selectedResultBinding: 'IWitness.resultSetController.selectedResult',

  didInsertElement: function() {
    // this.map = new Map(document.getElementById("map"), 34.043127, -118.266953); // LA
    // this.map = new Map(document.getElementById("map"), 37.754837,-122.430782); // SF
    this.map = new Map(document.getElementById("map"), 34.102022,-118.34043500000001); // Oscars
    this.map.addListener('bounds_changed', _.bind(_.debounce(this._mapUpdate, 100), this));
  },

  createMarkerForResult: function() {
    var lat = this.getPath('selectedResult.lat');
    var lng = this.getPath('selectedResult.lng');
    if (this.map) this.map.moveMarkerTo(lat, lng);
  }.observes('selectedResult'),

  _mapUpdate: function() {
    this.setPath('model.center', this.map.getCenter());
    this.setPath('model.zoom', this.map.getZoom());
    this.setPath('model.northEast', this.map.getNorthEast());
    this.setPath('model.southWest', this.map.getSouthWest());
    IWitness.criteriaController.initiateSearch();
  },

  zoom: function() {
    if (this.map) this.map.setZoom(this.getPath('model.zoom'));
  }.observes('model.zoom'),

  recenter: function() {
    if (this.map) this.map.setCenter(this.getPath('model.center'));
  }.observes('model.center'),

  addressField: Ember.TextField.extend({
    placeholder: 'enter address and press enter',

    insertNewline: function(e) {
      this.get('parentView').map.findAddress(this.$().val());
    }
  })
});
