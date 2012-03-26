IWitness.StarredMapView = Ember.View.extend({
  templateName: 'starred_map_template',
  // selectedResultBinding: 'IWitness.starredSetController.selectedResult',

  didInsertElement: function() {
    var self = this;
    window.MAP = this.map = new Map(document.getElementById("starred-map"), 40.735955030904755, -73.99026397144165); // OWS Union Sq
  },

  numberOfItems: function(){
    var num = this.getPath('IWitness.starredSetController.length');
    return num + " starred item" + (num == 1 ? "" : "s");
  }.property('IWitness.starredSetController.length'),

  numberFlaggedForExport: function(){
    var num = this.getPath('IWitness.starredSetController.length');
    return num + " flagged for export";
  }.property('IWitness.starredSetController.length')

  // createMarkerForResult: function() {
  //   var lat = this.getPath('selectedResult.lat');
  //   var lng = this.getPath('selectedResult.lng');
  //   if (this.map) this.map.moveMarkerTo(lat, lng);
  // }.observes('selectedResult')
});
