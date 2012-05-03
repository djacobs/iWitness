IWitness.MapPinView = Ember.View.extend({
  mapBinding: 'parentView.map',

  init: function() {
    this._super();
    var map = this.getPath("parentView.map"); // map binding not yet synced
    var result = this.get("content");
    var marker = map.addMarker(result.get("lat"), result.get("lng"), this.get("pinName"));
    google.maps.event.addListener(marker, 'click', _.bind(this.click, this));
    this.set("marker", marker);
  },

  willDestroy: function() {
    var map = this.get("map");
    map.removeMarker(this.get('marker'));
  },

  click: function() {
    IWitness.resultSetController.set('selectedResult', null); // force observers to fire
    IWitness.resultSetController.set('selectedResult', this.get("content"));
  },

  isSelected: function() {
    return this.get('content') === IWitness.resultSetController.get('selectedResult');
  }.property('content', 'IWitness.resultSetController.selectedResult'),

  isStarred: function() {
    return IWitness.starredSetController.isStarred(this.get('content'));
  }.property('content', 'IWitness.starredSetController.@each'),

  pinName: function() {
    var starred = this.get("isStarred");
    var selected = this.get("isSelected");
    var map = this.get("map");

    if (selected && starred) {
      return 'selected_starred';
    } else if (selected) {
      return 'selected';
    } else if (starred) {
      return 'starred';
    } else {
      return 'default';
    }
  }.property("isStarred", "isSelected"),

  updatePinImage: function() {
    this.get("map").changeMarker(this.get("marker"), this.get("pinName"));
  }.observes('pinName')

});
