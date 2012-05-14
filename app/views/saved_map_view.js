IWitness.SavedMapView = Ember.View.extend(IWitness.MapControl, {
  templateName:          'saved_map_template',
  isCurrentViewBinding:  'IWitness.currentViewController.showingSavedResults',
  selectedResultBinding: 'IWitness.savedSetController.selectedResult',

  didInsertElement: function() {
    this.insertMap();
    this.initZoomSlider();
  },

  insertMap: function() {
    var self = this;
    if (this.get('isCurrentView') && !this.get('map')) {

      // wait until the map container gets drawn before rendering it or craziness ensues.
      _.defer(function(){

        var startingLocation;
        if(IWitness.savedSetController.get('length') > 0) {
          var firstResult = IWitness.savedSetController.objectAt(0);
          startingLocation = [firstResult.get('lat'), firstResult.get('lng')];
          self.set("zoomLevel", 15);
        } else {
          startingLocation = [37.090301, -95.712919]; // Kansas!
          self.set("zoomLevel", 3);
        }

        var map = new Map(document.getElementById("saved-map"), startingLocation[0], startingLocation[1], self.get("zoomLevel"));
        map.addListener('zoom_changed', function(){
          self.set("zoomLevel", map.getZoom());
        });

        self.set("pins", Ember.CollectionView.create({
          contentBinding: 'IWitness.savedSetController.content',
          contentControllerBinding: 'IWitness.savedSetController',
          itemViewClass: "IWitness.SavedMapPinView",
          map: map
        }));
        self.set("map", map);
      });
    }
  }.observes('isCurrentView'),

  panMapToMarker: function() {
    var lat = this.getPath('selectedResult.lat');
    var lng = this.getPath('selectedResult.lng');
    var map = this.get("map");
    if (map) {
      map.panTo([lat, lng]);
    }
  }.observes('selectedResult')

});
