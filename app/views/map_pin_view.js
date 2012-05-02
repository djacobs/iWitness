IWitness.MapPinView = Ember.View.extend({
  init: function() {
    this._super();
    var map = this.getPath("parentView.map");
    var result = this.get("content");
    this.set("marker", map.addMarker(result.get("lat"), result.get("lng")));
  },

  willDestroy: function() {
    var map = this.getPath("parentView.map");
    map.removeMarker(this.get('marker'));
  },

  isSelected: function() {
    return this.get('content') === IWitness.resultSetController.get('selectedResult');
  }.property('content', 'IWitness.resultSetController.selectedResult'),

  selectPin: function() {
    if (this.get('isSelected')) {
      this.getPath('parentView.map').selectMarker(this.get('marker'));
    } else {
      this.getPath('parentView.map').unselectMarker(this.get('marker'));
    }
  }.observes('isSelected')

  // selected: function(){

  // }.property('IWitness.resultSetController.selectedResult'),
});
