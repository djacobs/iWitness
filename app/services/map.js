var Map = function(element, lat, lng) {
  this.map = new google.maps.Map(element, {
    center:    new google.maps.LatLng(lat, lng),
    zoom:      15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  this.geocoder = new google.maps.Geocoder();
};

_.extend(Map.prototype, {
  addListener: function(type, handler) {
    google.maps.event.addListener(this.map, type, handler);
  },

  removeListeners: function(type) {
    google.maps.event.clearListeners(this.map, type);
  },

  getCenter: function() {
    var point = this.map.getCenter();
    return [point.lat(), point.lng()];
  },

  setCenter: function(bounds) {
    var point = new google.maps.LatLng(bounds[0], bounds[1]);
    this.map.setCenter(point);
  },

  getZoom: function() {
    return this.map.getZoom();
  },

  setZoom: function(zoom) {
    this.map.setZoom(zoom);
  },

  getNorthEast: function() {
    var point = this.map.getBounds().getNorthEast();
    return [point.lat(), point.lng()];
  },

  getSouthWest: function() {
    var point = this.map.getBounds().getSouthWest();
    return [point.lat(), point.lng()];
  },

  moveMarkerTo: function(lat, lng) {
    if (this.marker) this.marker.setMap(null);

    if (lat && lng) {
      var position = new google.maps.LatLng(lat, lng);
      this.marker  = new google.maps.Marker({position: position, map: this.map});
    }
  },

  findAddress: function(address) {
    var self = this;

    this.geocoder.geocode({address: address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        self.map.setCenter(results[0].geometry.location);
      }
    });
  }
});

Map.Line = function(start, end) {
  this.start = new google.maps.LatLng(start[0], start[1]);
  this.end   = new google.maps.LatLng(end[0], end[1]);
}

_.extend(Map.Line.prototype, {
  length: function() {
    return google.maps.geometry.spherical.computeDistanceBetween(this.start, this.end);
  }
});

Map.Box = function(southWest, northEast) {
  southWest = new google.maps.LatLng(southWest[0], southWest[1]);
  northEast = new google.maps.LatLng(northEast[0], northEast[1]);
  this.box  = new google.maps.LatLngBounds(southWest, northEast);
}

_.extend(Map.Box.prototype, {
  contains: function(lat, lng) {
    var point = new google.maps.LatLng(lat, lng);
    return this.box.contains(point);
  }
});

