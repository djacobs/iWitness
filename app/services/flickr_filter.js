var FlickrFilter = function(params) {
  this.start = moment(params.start);
  this.end   = moment(params.end);
  this.center = params.center;
  this.radius = params.radius;
  this.mapTimezoneOffset  = params.mapTimezoneOffset;
};

FlickrFilter.offsetFlickrTime = function(flickrTimestamp, mapTimezoneOffset) {
  var offset = mapTimezoneOffset || 0;
  var timezone = '+0000';

  if (offset > 9) {
    timezone = '+' + Math.abs(offset) + '00';
  } else if (offset > 0) {
    timezone = '+0' + Math.abs(offset) + '00';
  } else if (offset < -9) {
    timezone = '-' + Math.abs(offset) + '00';
  } else if (offset < 0) {
    timezone = '-0' + Math.abs(offset) + '00';
  }

  var datetaken = flickrTimestamp + ' ' + timezone;
  return moment(datetaken, 'YYYY-MM-DD HH:mm:ss Z');
};

_.extend(FlickrFilter.prototype, {
  hasGeo: function(result){
    var coordinates = [result.latitude, result.longitude];
    var distance = new Map.Line(this.center, coordinates);
    return distance.length() <= this.radius;
  },

  inTimeframe: function(result) {
    var resultTime = FlickrFilter.offsetFlickrTime(result.datetaken, this.mapTimezoneOffset);
    return resultTime.isAfter(this.start) && resultTime.isBefore(this.end);
  },

  filter: function(results) {
    var self = this;
    return _.filter(results, function(result){
      return self.hasGeo(result) && self.inTimeframe(result);
    });
  }
});

