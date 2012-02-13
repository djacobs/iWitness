var TwitterFilter = function(params) {
  this.start = moment(params.start);
  this.end   = moment(params.end);
  this.box   = new Map.Box(params.southWest, params.northEast);
};

_.extend(TwitterFilter.prototype, {
  hasGeo: function(result){
    if (result.geo == null) return false;
    var coordinates = result.geo.coordinates;
    return this.box.contains(coordinates[0], coordinates[1]);
  },

  inTimeframe: function(result) {
    var resultTime  = moment(result.created_at);
    var inTimeframe = resultTime.isAfter(this.start) && resultTime.isBefore(this.end);
    return inTimeframe;
  },

  filter: function(results) {
    var self = this;
    return _.filter(results, function(result){
      return self.hasGeo(result) && self.inTimeframe(result);
    });
  }
});
