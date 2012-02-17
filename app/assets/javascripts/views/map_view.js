IWitness.MapView = Ember.View.extend({
  templateName:          'map_template',
  modelBinding:          'IWitness.searchController.content',
  selectedResultBinding: 'IWitness.resultSetController.selectedResult',

  didInsertElement: function() {
    this.map = new Map(document.getElementById("map"), 33.592744,-117.870255); // Newport Beach
    // this.map = new Map(document.getElementById("map"), 34.043127, -118.266953); // LA
    // this.map = new Map(document.getElementById("map"), 40.772742,-73.972321); // NY
    this.map.bind('bounds_changed', _.bind(_.debounce(this._mapUpdate, 100), this));
  },

  createMarkerForResult: function() {
    var lat = this.getPath('selectedResult.lat');
    var lng = this.getPath('selectedResult.lng');
    if (this.map) this.map.moveMarkerTo(lat, lng);
  }.observes('selectedResult'),

  _mapUpdate: function() {
    this.setPath('model.center', this.map.getCenter());
    this.setPath('model.northEast', this.map.getNorthEast());
    this.setPath('model.southWest', this.map.getSouthWest());
  },

  addressField: Ember.TextField.extend({
    placeholder: 'enter address and press enter',

    insertNewline: function(e) {
      this.get('parentView').map.findAddress(this.$().val());
    }
  })
});
