IWitness.StarredMapView = Ember.View.extend({
  templateName: 'starred_map_template',
  // selectedResultBinding: 'IWitness.curatedSetController.selectedResult',

  didInsertElement: function() {
    var self = this;
    window.MAP = this.map = new Map(document.getElementById("starred-map"), 40.735955030904755, -73.99026397144165); // OWS Union Sq
  },

  numberOfItems: function(){
    var num = this.getPath('IWitness.curatedSetController.length');
    return num + " starred item" + (num == 1 ? "" : "s");
  }.property('IWitness.curatedSetController.length'),

  numberFlaggedForExport: function(){
    var num = this.getPath('IWitness.curatedSetController.length');
    return num + " flagged for export";
  }.property('IWitness.curatedSetController.length')

  // createMarkerForResult: function() {
  //   var lat = this.getPath('selectedResult.lat');
  //   var lng = this.getPath('selectedResult.lng');
  //   if (this.map) this.map.moveMarkerTo(lat, lng);
  // }.observes('selectedResult')
});
