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
    var map = this.get("map");

    if (!map && this.get("ready") && center) {
      map = new Map(document.getElementById("map"), center[0], center[1], this.get('zoomLevel'));
      map.addListenerOnce('idle', function(){
        map.addListener('bounds_changed', _.bind(_.debounce(self._updateMap, 200), self));
        self._saveModel();
      });

      this.set("pins", Ember.CollectionView.create({
        contentBinding: 'IWitness.resultSetController.content',
        itemViewClass: "IWitness.MapPinView",
        map: map
      }));

      this.set("map", map);
    }
  }.observes('ready', 'model.center'),

  createMarkerForResult: function() {
    var lat = this.getPath('selectedResult.lat');
    var lng = this.getPath('selectedResult.lng');
    if (this.get('map')) this.get('map').moveMarkerTo(lat, lng);
  }.observes('selectedResult'),

  _criteriaChanged: function() {
    var map = this.get("map");
    return ! (
      Ember.compare(this.getPath('model.center'),    map.getCenter())    == 0 &&
      Ember.compare(this.getPath('model.zoom'),      map.getZoom())      == 0 &&
      Ember.compare(this.getPath('model.northEast'), map.getNorthEast()) == 0 &&
      Ember.compare(this.getPath('model.southWest'), map.getSouthWest()) == 0
    );
  },

  _saveModel: function() {
    var map = this.get("map");
    this.setPath('model.center', map.getCenter());
    this.setPath('model.zoom', map.getZoom());
    this.setPath('model.northEast', map.getNorthEast());
    this.setPath('model.southWest', map.getSouthWest());
  },

  _updateMap: function() {
    if (this.get('isCurrentView') && this._criteriaChanged()) {
      this._saveModel();
    }
  },

  recenter: function() {
    if (this.get('map')) this.get('map').setCenter(this.getPath('model.center'));
  }.observes('model.center'),

  findAddress: function() {
    var self = this,
        address = this.getPath('model.address');

    if (address){
      this.set('mapSearchStatus', 'scanning');
      this.get('map').findAddress(address, function(status) {
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
