IWitness.StarredMapView = Ember.View.extend({
  templateName: 'starred_map_template',
  currentViewBinding: 'IWitness.currentViewController',
  selectedResultBinding: 'IWitness.starredSetController.selectedResult',

  didInsertElement: function() {
    var self = this;
    this.insertMap();
    this.set("zoomLevel", Map.initialZoom);
    this.sliderEl = this.$('.map-zoom-control .slider').slider({
      value: Map.initialZoom,
      min: 1,
      max: 21,
      step: 1,
      slide: function(event, ui) {
        IWitness.log('zoom value', ui.value);
        self.set("zoomLevel", ui.value);
      }
    });
  },

  insertMap: function() {
    var self = this;
    if (this.getPath('currentView.showingStarredResults') && !this.map) {

      // wait until the map container gets drawn before rendering it or craziness ensues.
      _.defer(function(){

        var startingLocation;
        if(IWitness.starredSetController.get('length') > 0) {
          var firstResult = IWitness.starredSetController.objectAt(0);
          startingLocation = [firstResult.get('lat'), firstResult.get('lng')];
        } else {
          startingLocation = [40.735955030904755, -73.99026397144165]; // OWS Union Sq
        }

        self.map = new Map(document.getElementById("starred-map"), startingLocation[0], startingLocation[1]);
      });
    }
  }.observes('currentView.showingStarredResults'),

  createMarkerForResult: function() {
    var lat = this.getPath('selectedResult.lat');
    var lng = this.getPath('selectedResult.lng');
    if (this.map) {
      this.map.moveMarkerTo(lat, lng);
      this.map.panTo([lat, lng]);
    }
  }.observes('selectedResult'),

  zoom: function() {
    var level = this.get('zoomLevel');
    if (this.map) this.map.setZoom(level);
    if (this.sliderEl) this.sliderEl.slider("value", level);
  }.observes("zoomLevel"),

  zoomClass: function(){
    return 'l_' + this.get('zoomLevel');
  }.property('zoomLevel'),

  zoomIn: function() {
    this.incrementProperty("zoomLevel");
  },

  zoomOut: function() {
    this.decrementProperty("zoomLevel");
  },
});
