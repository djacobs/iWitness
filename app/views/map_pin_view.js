IWitness.MapPinView = Ember.View.extend({
  init: function() {
    this._super();
    var map = this.getPath("parentView.mapView").map;
    var result = this.get("content");
    this.set("marker", map.addMarker(result.get("lat"), result.get("lng")));
  },

  willDestroy: function() {
    var map = this.getPath("parentView.mapView").map;
    map.removeMarker(this.get('marker'));
  }
  // selected: function(){

  // }.property('IWitness.resultSetController.selectedResult'),
});
