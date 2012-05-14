IWitness.MapPinView = Ember.View.extend({
  mapBinding:               'parentView.map',
  contentControllerBinding: 'parentView.contentController',
  isVisibleBinding:         'visibilityMonitor.isVisible',
  allReadyBinding:          Ember.Binding.and("map", "content", "content.lat", "content.lng"),

  _addMarker: function() {
    if (this.get("initialized") || !this.get("allReady")) return;

    var map = this.getPath("map");
    var result = this.get("content");
    var visibilityMonitor = IWitness.VisibilityMonitor.create({result: result});
    var marker = map.addMarker(result.get("lat"), result.get("lng"), this.get("pinName"));
    google.maps.event.addListener(marker, 'click', _.bind(this.click, this));
    this.setProperties({marker: marker, visibilityMonitor: visibilityMonitor, initialized: true});
  }.observes('allReady'),

  willDestroy: function() {
    this._super();
    var marker = this.get("marker");
    if (marker) this.get("map").removeMarker(marker);
  },

  click: function() {
    this.get("contentController").set('selectedResult', null); // force observers to fire
    this.get("contentController").set('selectedResult', this.get("content"));
  },

  isSelected: function() {
    return this.get('content') === this.getPath("contentController.selectedResult");
  }.property('content', 'contentController.selectedResult'),

  isSaved: function() {
    return IWitness.savedSetController.isSaved(this.get('content'));
  }.property('content', 'IWitness.savedSetController.@each'),

  setVisible: function() {
    var marker = this.get("marker");
    if (marker) marker.setVisible(this.get("isVisible"));
  }.observes("isVisible"),

  pinName: function() {
    var saved = this.get("isSaved");
    var selected = this.get("isSelected");
    var map = this.get("map");

    if (selected && saved) {
      return 'selected_saved';
    } else if (selected) {
      return 'selected';
    } else if (saved) {
      return 'saved';
    } else {
      return 'default';
    }
  }.property("isSaved", "isSelected"),

  updatePinImage: function() {
    var marker = this.get("marker");
    if (marker) this.get("map").changeMarker(marker, this.get("pinName"));
  }.observes('pinName'),

  _makeVisible: function(){
    this.get("marker").setVisible(true);
  }

});

IWitness.SavedMapPinView = IWitness.MapPinView.extend({
  isVisible: true
});
