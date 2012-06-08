IWitness.Criteria = Ember.Object.extend({
  useLocalTime: true,
  stream:       true,
  keyword:      "",
  address:      "",
  center:       null,
  zoom:         3,

  init: function() {
    this._super();
    this.setProperties({rawStart: moment().subtract("hours", 1), rawEnd: moment()});
    this.trackCurrentTime();
  },

  timezoneOffset: function() {
    return (new Date()).getTimezoneOffset() / -60;
  }.property(),

  mapTimezoneOffset: function() {
    var center, dt;

    if (center = this.get('center')) {
      dt = this.get("rawStart").toDate() || new Date();
      return IWitness.spaceTime.utcOffset(dt, center) / 60;
    } else {
      return this.get("timezoneOffset");
    }
  }.property('center', 'IWitness.spaceTime.isLoaded', 'rawStart'),

  timezoneDifference: function() {
    return this.get('timezoneOffset') - this.get('mapTimezoneOffset');
  }.property('timezoneOffset', 'mapTimezoneOffset'),

  rawStart: function(key, value) {
    if (arguments.length === 1) {
      return moment(this.get('startDateString') + ' ' + this.get('startTimeString'));
    } else {
      value = moment(value);
      this.set('startDateString', value.format('M/D/YYYY'));
      this.set('startTimeString', value.format('h:mm A'));
      return value;
    }
  }.property('startDateString', 'startTimeString'),

  rawEnd: function(key, value) {
    if (arguments.length === 1) {
      return moment(this.get('endDateString') + ' ' + this.get('endTimeString'));
    } else {
      value = moment(value);
      this.set('endDateString', value.format('M/D/YYYY'));
      this.set('endTimeString', value.format('h:mm A'));
      return value;
    }
  }.property('endDateString', 'endTimeString'),

  start: function() {
    return this._getAdjustedForMap('rawStart');
  }.property('rawStart', 'useLocalTime', 'timezoneDifference'),

  end: function() {
    return this._getAdjustedForMap('rawEnd');
  }.property('rawEnd', 'useLocalTime', 'timezoneDifference'),

  radius: function() {
    var center = this.get('center');
    var corner = this.get('northEast');
    if (!(center && corner)) return 0;

    var top = [corner[0], center[1]];
    var height = new Map.Line(center, top);

    return height.length() * Map.circleRadiusRatio;
  }.property('center', 'northEast'),

  getParams: function() {
    return this.getProperties('mapTimezoneOffset',
                              'center',
                              'radius',
                              'keyword',
                              'start',
                              'end',
                              'northEast',
                              'southWest',
                              'zoom',
                              'stream');
  },

  errors: function() {
    return _.compact([this.get("mapError"), this.get("timeError")]);
  }.property("mapError", "timeError"),

  isValid: function() {
    return _.isEmpty(this.get('errors'));
  }.property('errors'),

  timeError: function() {
    if (!this.get('stream') && moment(this.get('end')).isBefore(moment(this.get('start')))) {
      return "Please select an end date that comes after the start date.";
    }
  }.property("start", "end", "stream"),

  mapError: function() {
    if (!this.get('northEast') || !this.get('southWest')) {
      return "Please choose your location to begin.";
    }

    if (this.get('radius') > 75000) {
      return "Please zoom in to begin.";
    }
  }.property("radius", "northEast", "southWest"),

  trackCurrentTime: function() {
    var self = this;
    self.set('currentTime', moment());
    setInterval(function() { self.set('currentTime', moment()) }, 2000);
  },

  streamingTime: function() {
    var m = moment(this.get('currentTime')); // don't mutate current time property
    return m.subtract('hours', this.get('timezoneDifference'));
  }.property('currentTime', 'timezoneDifference'),

  _getAdjustedForMap: function(prop) {
    if (this.get('useLocalTime')) {
      return this.get(prop);
    } else {
      var adjustedTime = moment(this.get(prop));
      adjustedTime.add('hours', this.get('timezoneDifference'));
      return adjustedTime;
    }
  },

  setDefaultCenter: function() {
    var self = this, center, zoom;
    $.ajax('http://freegeoip.net/json/?callback=?', {
      dataType: 'json',
      success: function(locData) {
        if (locData.latitude && locData.longitude) {
          center = [locData.latitude, locData.longitude];
          zoom = 9;
        } else {
          center = [37.75771992816863 ,-122.43760000000003]; // SF
          zoom = 11;
        }
        IWitness.log('defaulting map center to', center);
        self.setProperties({center: center, zoom: zoom});
      },
      fail: function() {
        var center = [37.75771992816863 ,-122.43760000000003]; // SF
        var zoom = 11;
        IWitness.log('defaulting map center to', center);
        self.setProperties({center: center, zoom: zoom});
      }
    });
  }
});

IWitness.criteria = IWitness.Criteria.create();
