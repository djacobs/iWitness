IWitness.MapView = Ember.View.extend(IWitness.MapControl, {
  templateName:          'map_template',
  modelBinding:          'IWitness.criteriaController.content',
  selectedResultBinding: 'IWitness.resultSetController.selectedResult',
  zoomLevelBinding:      "model.zoom",
  mapSearchStatus:       'finished',
  isCurrentViewBinding:  'IWitness.currentViewController.showingSearchResults',

  didInsertElement: function() {
    // this.map = new Map(document.getElementById("map"), 34.043127, -118.266953); // LA
    // this.map = new Map(document.getElementById("map"), 37.754837,-122.430782); // SF
    // this.map = new Map(document.getElementById("map"), 34.102022,-118.34043500000001); // Oscars
    // this.map = new Map(document.getElementById("map"), 40.735955030904755, -73.99026397144165); // OWS Union Sq
    this.map = new Map(document.getElementById("map"), 37.090301, -95.712919, 3) // Kansas!
    this.map.addListener('idle', _.bind(this._mapReady, this));

    this.set("zoomLevel", this.get("model.zoom") || 3);
    this.initZoomSlider();
  },

  createMarkerForResult: function() {
    var lat = this.getPath('selectedResult.lat');
    var lng = this.getPath('selectedResult.lng');
    if (this.map) this.map.moveMarkerTo(lat, lng);
  }.observes('selectedResult'),

  _mapReady: function() {
    this._saveModel();
    this.map.removeListeners('idle');
    this.map.addListener('bounds_changed', _.bind(_.debounce(this._updateMap, 200), this));
  },

  _saveModel: function() {
    this.setPath('model.center', this.map.getCenter());
    this.setPath('model.zoom', this.map.getZoom());
    this.setPath('model.northEast', this.map.getNorthEast());
    this.setPath('model.southWest', this.map.getSouthWest());
  },

  _updateMap: function() {
    this._saveModel();
    IWitness.criteriaController.initiateSearch();
  },

  recenter: function() {
    if (this.map) this.map.setCenter(this.getPath('model.center'));
  }.observes('model.center'),

  findAddress: function() {
    var self = this,
        address = this.getPath('model.address');

    if (address){
      this.set('mapSearchStatus', 'scanning');
      this.map.findAddress(address, function(status) {
        status = status ? 'finished' : 'somethings_wrong';
        self.set('mapSearchStatus', status);
      });
    }
  },

  addressField: Ember.TextField.extend({
    placeholder: 'Enter address and press enter',
    valueBinding: 'parentView.model.address',

    insertNewline: function(e) {
      this.get('parentView').findAddress();
    },

    focusIn: function(e) {
      this.$().attr('placeholder', '');
    },

    focusOut: function(e) {
      this.$().attr('placeholder', 'Enter address and press enter');
    }
  })
});
