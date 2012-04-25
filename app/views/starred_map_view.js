IWitness.StarredMapView = Ember.View.extend(IWitness.MapControl, {
  templateName:          'starred_map_template',
  isCurrentViewBinding:  'IWitness.currentViewController.showingStarredResults',
  selectedResultBinding: 'IWitness.starredSetController.selectedResult',

  didInsertElement: function() {
    var self = this;
    this.insertMap();
    this.set("zoomLevel", 15);
    this.initZoomSlider();
  },

  insertMap: function() {
    var self = this;
    if (this.get('isCurrentView') && !this.map) {

      // wait until the map container gets drawn before rendering it or craziness ensues.
      _.defer(function(){

        var startingLocation, startingZoom;
        if(IWitness.starredSetController.get('length') > 0) {
          var firstResult = IWitness.starredSetController.objectAt(0);
          startingLocation = [firstResult.get('lat'), firstResult.get('lng')];
          startingZoom = 15;
        } else {
          startingLocation = [37.090301, -95.712919]; // Kansas!
          startingZoom = 3;
        }

        self.map = new Map(document.getElementById("starred-map"), startingLocation[0], startingLocation[1], startingZoom);
        self.map.addListener('zoom_changed', function(){
          self.set("zoomLevel", self.map.getZoom());
        });
      });
    }
  }.observes('isCurrentView'),

  createMarkerForResult: function() {
    var lat = this.getPath('selectedResult.lat');
    var lng = this.getPath('selectedResult.lng');
    if (this.map) {
      this.map.moveMarkerTo(lat, lng);
      this.map.panTo([lat, lng]);
    }
  }.observes('selectedResult')
});
