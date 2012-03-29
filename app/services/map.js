var Map = function(element, lat, lng) {
  this.map = new google.maps.Map(element, {
    center:    new google.maps.LatLng(lat, lng),
    zoom:      Map.initialZoom,
    mapTypeControl: false,
    scaleControl: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: [
      {
      featureType: "landscape",
      elementType: "geometry",
      stylers: [
        { invert_lightness: true },
        { saturation: -100 },
        { lightness: 29 }
      ]
    },{
      featureType: "road",
      stylers: [
        { saturation: -98 },
        { lightness: -41 }
      ]
    },{
      stylers: [
        { visibility: "on" }
      ]
    },{
      featureType: "landscape.man_made",
      stylers: [
        { visibility: "off" }
      ]
    },{
      featureType: "poi",
      elementType: "geometry",
      stylers: [
        { visibility: "on" },
        { invert_lightness: true },
        { saturation: -99 },
        { lightness: 20 }
      ]
    },{
      featureType: "water",
      stylers: [
        { lightness: -56 },
        { saturation: -44 }
      ]
    },{
      featureType: "transit",
      elementType: "geometry",
      stylers: [
        { saturation: -100 },
        { lightness: -54 }
      ]
    },{
      featureType: "administrative.land_parcel",
      elementType: "geometry",
      stylers: [
        { visibility: "off" }
      ]
    },{
      featureType: "administrative",
      elementType: "labels",
      stylers: [
        { invert_lightness: true },
        { saturation: -99 },
        { lightness: 12 }
      ]
    },{
      featureType: "poi",
      elementType: "labels",
      stylers: [
        { invert_lightness: true },
        { saturation: -100 },
        { lightness: 19 },
        { gamma: 0.94 }
      ]
    },{
      featureType: "transit",
      elementType: "labels",
      stylers: [
        { invert_lightness: true },
        { saturation: -99 },
        { lightness: 16 }
      ]
    },{
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [
        { hue: "#ff8800" },
        { lightness: -36 },
        { saturation: 55 }
      ]
    },{
      featureType: "road.arterial",
      stylers: [
        { hue: "#ff8800" },
        { visibility: "on" },
        { saturation: -100 },
        { lightness: -1 }
      ]
    },{
      featureType: "road.local",
      stylers: [
        { lightness: -26 }
      ]
    },{
      featureType: "road",
      elementType: "labels",
      stylers: [
        { visibility: "on" },
        { invert_lightness: true },
        { saturation: -100 },
        { lightness: -6 },
        { gamma: 0.75 }
      ]
    },{
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [
        { saturation: -96 },
        { lightness: 49 }
      ]
    },{
      featureType: "road.highway",
      elementType: "labels",
      stylers: [
        { invert_lightness: true },
        { lightness: -18 },
        { gamma: 1.58 }
      ]
    },{
      featureType: "poi",
      elementType: "labels",
      stylers: [
        { saturation: -48 },
        { lightness: 15 },
        { gamma: 0.86 }
      ]
    }]
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
Map.initialZoom = 17;

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
        self.map.setCenter(results[0].geometry.location);
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

