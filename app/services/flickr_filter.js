var FlickrFilter = function(params) {
  this.start = moment(params.start);
  this.end   = moment(params.end);
  this.center = params.center;
  this.radius = params.radius;
};

_.extend(FlickrFilter.prototype, {
  hasGeo: function(result){
    var coordinates = [result.latitude, result.longitude];
    var distance = new Map.Line(this.center, coordinates);
    return distance.length() <= this.radius;
  },

  filter: function(results) {
    var self = this;
    return _.filter(results, function(result){
      return self.hasGeo(result);
    });
  }
});
