var TwitterFilter = function(params) {
  this.start = moment(params.start);
  this.end   = moment(params.end);
  this.center = params.center;
  this.radius = params.radius;
};

_.extend(TwitterFilter.prototype, {
  hasGeo: function(result){
    if (result.geo == null) return false;
    var coordinates = result.geo.coordinates;

    var distance = new Map.Line(this.center, coordinates);
    return distance.length() <= this.radius;
  },

  inTimeframe: function(result) {
    var resultTime  = moment(result.created_at);
    var inTimeframe = resultTime.isAfter(this.start) && resultTime.isBefore(this.end);
    return inTimeframe;
  },

  filterGeo: function(results){
    var self = this;
    return _.filter(results, function(result){
      return self.hasGeo(result);
    });
  },

  filter: function(results) {
    var self = this;
    return _.filter(results, function(result){
      return self.hasGeo(result) && self.inTimeframe(result);
    });
  }
});
