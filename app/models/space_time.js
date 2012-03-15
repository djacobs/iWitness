IWitness.spaceTime = Ember.Object.create({
  init: function() {
    var self = this;

    $.getJSON('timezones.json', function(zones){
      self.set('kdTree', new KDTree(zones));
    });
  },

  utcOffset: function(date, point) {
    if (this.get('isLoaded')){
      var zone = this.get('kdTree').getNearestNeighbour({x:point[0], y:point[1]});
      var zoneinfo = timezoneJS.timezone.getTzInfo(date, zone.z);
      return -zoneinfo.tzOffset;
    } else {
      return 0;
    }
  },

  isLoaded: function() {
    return !!this.get('kdTree');
  }.property('kdTree')
});
