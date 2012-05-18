var Map = function(element, lat, lng, zoom) {
  this.map = new google.maps.Map(element, {
    center:         new google.maps.LatLng(lat, lng),
    zoom:           zoom,
    mapTypeControl: false,
    scaleControl:   false,
    mapTypeId:      google.maps.MapTypeId.ROADMAP,
    scrollwheel:    false,
    backgroundColor:"000",
    styles: Map.Style
  });

  var circleOverlay = window.CIRCLE =
    $('<div id="circleOverlay"></div>').css({
    'background'    : 'url(images/overlay.png)',
    'opacity'       : '1',
    'width'         : '100%',
    'height'        : '1200px',
    'pointerEvents' : 'none'
  });

  var size = new google.maps.Size(24, 35);
  var width = 27;
  this.pinImages = {
    default:        new google.maps.MarkerImage('images/pins.png', size, new google.maps.Point(width, 0)),
    selected:       new google.maps.MarkerImage('images/pins.png', size, new google.maps.Point(width*3, 0)),
    saved:          new google.maps.MarkerImage('images/pins.png', size, new google.maps.Point(0, 0)),
    selected_saved: new google.maps.MarkerImage('images/pins.png', size, new google.maps.Point(width*2, 0)),
    isPriority: function(pinName) { return pinName.match(/selected/) }
  };
  this.secondaryPinZIndex = google.maps.Marker.MAX_ZINDEX + 1;
  this.priorityPinZIndex  = this.secondaryPinZIndex + 10000;

  var circle = circleOverlay.get(0);
  circle.index = -1;

  this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(circle);

  this.geocoder = new google.maps.Geocoder();
};

// radius of circle overlay / (height of map / 2)
Map.circleRadiusRatio = 0.935; // = 168 / (359 / 2)

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

  addMarker: function(lat, lng, pinName, visible) {
    if (lat && lng) {
      var position = new google.maps.LatLng(lat, lng);
      return new google.maps.Marker({
        position: position,
        map: this.map,
        icon: this.pinImages[pinName],
        visible: false,
        animation: google.maps.Animation.DROP
      });
    }
  },

  removeMarker: function(marker) {
    marker.setMap(null);
  },

  changeMarker: function(marker, pinName) {
    if (marker.getIcon() !== this.pinImages[pinName]) {
      marker.setIcon(this.pinImages[pinName]);

      if (this.pinImages.isPriority(pinName)) {
        marker.setZIndex(this.priorityPinZIndex++);
      } else {
        marker.setZIndex(this.secondaryPinZIndex++);
      }
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

Map.createStyle = function(baseLightness) {
  return [
    {
      elementType: "geometry",
      stylers: [
        { invert_lightness: true },
        { lightness: baseLightness },
        { saturation: -98 }
      ]
    },{
      featureType: "water",
      elementType: "geometry",
      stylers: [
        { saturation: 20 },
        { lightness: 15 }
      ]
    }, {
      featureType: "landscape",
      elementType: "geometry",
      stylers: [
        { visibility: "off" },
      ]
    }, {
      featureType: "administrative",
      elementType: "geometry",
      stylers: [
        { visibility: "on" },
        { saturation: -99 },
        { lightness: 5 }
      ]
    }, {
      elementType: "labels",
      stylers: [
        { invert_lightness: true },
        { saturation: -100 },
        { lightness: 17 },
        { gamma: 0.8 }
      ]
    }, {
      featureType: "road.arterial",
      elementType: "geometry",
      stylers: [
        { visibility: "on" },
        { lightness: 12 }
      ]
    }, {
      featureType: "road.local",
      elementType: "geometry",
      stylers: [
        { visibility: "simplified" },
        { saturation: -100 },
        { lightness: 33 }
      ]
    }, {
      featureType: "poi",
      elementType: "geometry",
      stylers: [
        { visibility: "off" }
      ]
    }, {
      featureType: "administrative.land_parcel",
      stylers: [
        { visibility: "off" }
      ]
    }, {
      featureType: "road.highway",
      elementType: "labels",
      stylers: [
        { visibility: "on" },
        { saturation: -98 },
      ]
    }, {
      featureType: "road.arterial",
      elementType: "geometry",
      stylers: [
        { visibility: "simplified" }
      ]
    }
  ]};

Map.Style = Map.createStyle(15);

Map.StaticStyle = "style=" +
  _(Map.createStyle(25)).map(function(style){
    var args = [];
    if (style.featureType)
      args.push("feature:" + style.featureType);
    if (style.elementType)
      args.push("element:" + style.elementType);

    _.each(style.stylers, function(s){
      _.each(s, function(value, key) {
        args.push(key + ':' + value);
      });
    });

    return args.join("%7C");

  }).join("&style=");
