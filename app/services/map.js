var Map = function(element, lat, lng, zoom) {
  this.map = new google.maps.Map(element, {
    center:         new google.maps.LatLng(lat, lng),
    zoom:           zoom,
    mapTypeControl: false,
    scaleControl:   false,
    mapTypeId:      google.maps.MapTypeId.ROADMAP,
    scrollwheel:    false,
    backgroundColor:"000",
    styles: [
      {
        featureType: "landscape",
        elementType: "geometry",
        stylers: [
          { invert_lightness: true },
          { visibility: "off" },
          { saturation: -100 },
          { lightness: 15 }
        ]
      },{
        featureType: "poi",
        elementType: "geometry",
        stylers: [
          { invert_lightness: true },
          { lightness: 15 },
          { saturation: -100 }
        ]
      },{
        featureType: "road",
        elementType: "geometry",
        stylers: [
          { invert_lightness: true },
          { saturation: -100 },
          { lightness: 10 }
        ]
      },{
        featureType: "transit",
        stylers: [
          { invert_lightness: true },
          { saturation: -99 },
          { lightness: 15 }
        ]
      },{
        featureType: "water",
        elementType: "geometry",
        stylers: [
          { saturation: -51 },
          { lightness: -44 }
        ]
      },{
        featureType: "administrative",
        elementType: "geometry",
        stylers: [
          { visibility: "on" },
          { saturation: -99 },
          { lightness: -71 }
        ]
      },{
        featureType: "administrative",
        elementType: "labels",
        stylers: [
          { invert_lightness: true },
          { saturation: -100 },
          { lightness: 25 },
          { gamma: 0.84 }
        ]
      },{
        featureType: "landscape",
        elementType: "labels",
        stylers: [
          { invert_lightness: true },
          { saturation: -100 }
        ]
      },{
        featureType: "poi",
        elementType: "labels",
        stylers: [
          { invert_lightness: true },
          { saturation: -99 },
          { gamma: 0.87 },
          { lightness: 17 }
        ]
      },{
        featureType: "road",
        elementType: "labels",
        stylers: [
          { invert_lightness: true },
          { saturation: -100 }
        ]
      },{
        featureType: "transit",
        elementType: "labels",
        stylers: [
          { invert_lightness: true },
          { saturation: -100 }
        ]
      },{
        featureType: "water",
        elementType: "labels",
        stylers: [
          { invert_lightness: true },
          { saturation: -100 },
          { lightness: 18 },
          { gamma: 1.34 }
        ]
      },{
      },{
        featureType: "landscape.man_made",
        elementType: "geometry",
        stylers: [
          { visibility: "on" }
        ]
      },{
        featureType: "road.arterial",
        elementType: "geometry",
        stylers: [
          { visibility: "on" },
          { lightness: 12 }
        ]
      },{
        featureType: "road.local",
        elementType: "geometry",
        stylers: [
          { visibility: "simplified" },
          { saturation: -100 },
          { lightness: 33 }
        ]
      },{
        featureType: "road.local",
        elementType: "labels",
        stylers: [
          { visibility: "on" },
          { lightness: 23 },
          { gamma: 0.95 }
        ]
      },{
        featureType: "poi",
        elementType: "geometry",
        stylers: [
          { saturation: -60 },
          { lightness: 5 },
          { visibility: "off" }
        ]
      },{
        featureType: "poi",
        elementType: "geometry",
        stylers: [
          { visibility: "off" }
        ]
      },{
        featureType: "landscape",
        elementType: "geometry",
        stylers: [
          { visibility: "off" }
        ]
      },{
        featureType: "poi.business",
        elementType: "geometry",
        stylers: [
          { visibility: "off" }
        ]
      },{
        featureType: "transit",
        elementType: "geometry",
        stylers: [
          { visibility: "off" }
        ]
      },{
        featureType: "administrative.land_parcel",
        stylers: [
          { visibility: "off" }
        ]
      },{
        featureType: "transit",
        elementType: "labels",
        stylers: [
          { visibility: "on" },
          { invert_lightness: true }
        ]
      },{
        featureType: "road.highway",
        elementType: "labels",
        stylers: [
          { visibility: "on" },
          { saturation: -98 },
          { lightness: -5 }
        ]
      },{
        featureType: "road.arterial",
        elementType: "geometry",
        stylers: [
          { visibility: "simplified" }
        ]
      },{
        featureType: "road.arterial",
        elementType: "labels",
        stylers: [
          { visibility: "on" },
          { lightness: 11 }
        ]
      },{
        featureType: "landscape",
        stylers: [
          { visibility: "off" }
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

  this.pinShadow = new google.maps.MarkerImage('images/pin_shadow.png',
                                               new google.maps.Size(53, 41),
                                               new google.maps.Point(0,0),
                                               new google.maps.Point(4,49));

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

  addListenerOnce: function(type, handler) {
    google.maps.event.addListenerOnce(this.map, type, handler);
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

  forceResize: function(args) {
    google.maps.event.trigger(this.map, "resize");
  },

  panTo: function(bounds) {
    var point = new google.maps.LatLng(bounds[0], bounds[1]);
    this.map.panTo(point);
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
      this.marker  = new google.maps.Marker({position: position, map: this.map, icon: 'images/pin.png', shadow: this.pinShadow});
    }
  },

  findAddress: function(address, hollaback) {
    var self = this;

    this.geocoder.geocode({address: address}, function(results, status) {
      var found = false;
      if (status == google.maps.GeocoderStatus.OK) {
        self.map.fitBounds(results[0].geometry.viewport);
        found = true;
      }
      hollaback(found);
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
