IWitness.MapView = Ember.View.extend(IWitness.MapControl, {
  templateName:          'map_template',
  modelBinding:          'IWitness.criteriaController.content',
  selectedResultBinding: 'IWitness.resultSetController.selectedResult',
  zoomLevelBinding:      "model.zoom",
  mapSearchStatus:       'finished',
  isCurrentViewBinding:  'IWitness.currentViewController.showingSearchResults',
  ready:                 false,

  didInsertElement: function() {
    this.set('ready', true);
    this.initZoomSlider();
  },

  _initMap: function(){
    var self = this;
    var center = this.getPath('model.center');
    if (!this.map && this.get("ready") && center) {
      this.map = new Map(document.getElementById("map"), center[0], center[1], this.get('zoomLevel'));
      this.map.addListenerOnce('idle', function(){
        self.map.addListener('bounds_changed', _.bind(_.debounce(self._updateMap, 200), self));
        self._updateMap();
      });
    }
  }.observes('ready', 'model.center'),

  createMarkerForResult: function() {
    var lat = this.getPath('selectedResult.lat');
    var lng = this.getPath('selectedResult.lng');
    if (this.map) this.map.moveMarkerTo(lat, lng);
  }.observes('selectedResult'),

  _criteriaChanged: function() {
    return ! (
      Ember.compare(this.getPath('model.center'), this.map.getCenter()) == 0 &&
      Ember.compare(this.getPath('model.zoom'), this.map.getZoom()) == 0 &&
      Ember.compare(this.getPath('model.northEast'), this.map.getNorthEast()) == 0 &&
      Ember.compare(this.getPath('model.southWest'), this.map.getSouthWest()) == 0
    );
  },

  _saveModel: function() {
    this.setPath('model.center', this.map.getCenter());
    this.setPath('model.zoom', this.map.getZoom());
    this.setPath('model.northEast', this.map.getNorthEast());
    this.setPath('model.southWest', this.map.getSouthWest());
  },

  _updateMap: function() {
    if (this.get('isCurrentView') && this._criteriaChanged()) {
      this._saveModel();
      IWitness.criteriaController.initiateSearch();
    }
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
