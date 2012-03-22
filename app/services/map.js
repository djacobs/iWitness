var Map = function(element, lat, lng) {
  this.map = new google.maps.Map(element, {
    center:    new google.maps.LatLng(lat, lng),
    zoom:      15,
    mapTypeControl: false,
    scaleControl: true,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: false,
    styles: [
      {
        featureType: "landscape.man_made",
        stylers: [
          { invert_lightness: true },
          { gamma: 0.5 },
          { visibility: "on" },
          { saturation: -4 },
          { lightness: 46 }
        ]
      },{
        featureType: "water",
        elementType: "labels",
        stylers: [
          { gamma: 0.37 },
          { saturation: -6 },
          { lightness: 44 },
          { visibility: "on" }
        ]
      },{
        featureType: "poi",
        elementType: "geometry",
        stylers: [
          { saturation: -100 },
          { lightness: -60 },
          { gamma: 0.88 },
          { visibility: "simplified" }
        ]
      },{
        featureType: "poi",
        elementType: "labels",
        stylers: [
          { visibility: "on" },
          { invert_lightness: true },
          { saturation: -96 },
          { lightness: 24 },
          { gamma: 0.82 }
        ]
      },{
        featureType: "road",
        elementType: "geometry",
        stylers: [
          { hue: "#ff6600" },
          { visibility: "simplified" },
          { lightness: -19 }
        ]
      },{
        elementType: "labels",
        stylers: [
          { visibility: "on" },
          { invert_lightness: true },
          { hue: "#00eeff" },
          { gamma: 0.64 },
          { lightness: 19 },
          { saturation: -99 }
        ]
      },{
        featureType: "road.local",
        elementType: "geometry",
        stylers: [
          { visibility: "on" },
          { lightness: -39 }
        ]
      },{
        elementType: "labels",
        stylers: [
          { saturation: -100 },
          { lightness: 25 },
          { gamma: 0.72 }
        ]
      },{
        featureType: "poi",
        elementType: "labels",
        stylers: [
          { visibility: "on" },
          { invert_lightness: true }
        ]
      },{
        featureType: "water",
        elementType: "labels",
        stylers: [
          { saturation: 5 },
          { invert_lightness: true },
          { hue: "#00ffc4" },
          { gamma: 0.01 },
          { lightness: 6 }
        ]
      },{
        featureType: "water",
        elementType: "geometry",
        stylers: [
          { invert_lightness: true },
          { lightness: 11 },
          { saturation: -19 }
        ]
      },{
        featureType: "water",
        elementType: "labels",
        stylers: [
          { invert_lightness: true },
          { gamma: 1.26 },
          { lightness: -85 }
        ]
      },{
        featureType: "road",
        elementType: "geometry",
        stylers: [
          { saturation: -30 }
        ]
      },{
        featureType: "administrative.land_parcel",
        stylers: [
          { visibility: "off" }
        ]
      },{
        featureType: "road.local",
        elementType: "geometry",
        stylers: [
          { visibility: "simplified" },
          { lightness: -25 },
          { gamma: 1.06 },
          { saturation: -100 }
        ]
      },{
        featureType: "landscape",
        elementType: "geometry",
        stylers: [
          { visibility: "off" },
          { saturation: -100 },
          { lightness: -71 }
        ]
      },{
        featureType: "road.highway.controlled_access",
        elementType: "labels",
        stylers: [
          { visibility: "on" },
          { saturation: -95 },
          { lightness: -10 },
          { gamma: 0.74 }
        ]
      },{
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [
          { visibility: "on" },
          { gamma: 0.64 },
          { saturation: 29 },
          { lightness: 19 }
        ]
      },{
        featureType: "road.arterial",
        stylers: [
          { hue: "#ff6600" },
          { lightness: -16 },
          { saturation: 5 }
        ]
      },{
      }
    ]
  });

  var circleOverlay = window.CIRCLE =
  $('<div id="circleOverlay"></div>').css({
    'background'    : 'url(images/overlay.png)',
    'opacity'       : '1',
    'width'         : '100%',
    'height'        : '1200px',
    'pointerEvents' : 'none'
  });

  var circle = circleOverlay.get(0);
  circle.index = -1;

  this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(circle);

  this.geocoder = new google.maps.Geocoder();
};

// radius of circle overlay / (height of map / 2)
Map.circleRadiusRatio = 0.932; // = 220 / (472 / 2)

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

