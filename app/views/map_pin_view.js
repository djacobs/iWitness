IWitness.MapPinView = Ember.View.extend({
  init: function() {
    this._super();
    var map = this.getPath("parentView.map");
    var result = this.get("content");
    this.set("marker", map.addMarker(result.get("lat"), result.get("lng"), this.get("pinImage")));
  },

  willDestroy: function() {
    var map = this.getPath("parentView.map");
    map.removeMarker(this.get('marker'));
  },

  isSelected: function() {
    return this.get('content') === IWitness.resultSetController.get('selectedResult');
  }.property('content', 'IWitness.resultSetController.selectedResult'),

  isStarred: function() {
    return IWitness.starredSetController.isStarred(this.get('content'));
  }.property('content', 'IWitness.starredSetController.@each'),

  pinImage: function() {
    var starred = this.get("isStarred");
    var selected = this.get("isSelected");
    var map = this.getPath("parentView.map");

    if (selected && starred) {
      return map.selectedStarredPinImage;
    } else if (selected) {
      return map.selectedPinImage;
    } else if (starred) {
      return map.starredPinImage;
    } else {
      return map.pinImage;
    }
  }.property("isStarred", "isSelected"),

  updatePinImage: function() {
    this.getPath("parentView.map").changeMarker(this.get("marker"), this.get("pinImage"));
  }.observes('pinImage')

});
