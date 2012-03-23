IWitness.Criteria = Ember.Object.extend({
  useLocalTime: true,
  stream: false,
  keyword: "",
  address: "",

  timezoneOffset: function() {
    return (new Date()).getTimezoneOffset() / -60;
  }.property().cacheable(),

  mapTimezoneOffset: function() {
    var center, dt;

    if (center = this.get('center')) {
      dt = this.get("rawStart").toDate() || new Date();
      return IWitness.spaceTime.utcOffset(dt, center) / 60;
    } else {
      return this.get("timezoneOffset");
    }
  }.property('center', 'IWitness.spaceTime.isLoaded', 'rawStart').cacheable(),

  timezoneDifference: function() {
    return this.get('timezoneOffset') - this.get('mapTimezoneOffset');
  }.property('timezoneOffset', 'mapTimezoneOffset').cacheable(),

  rawStart: function(key, value) {
    if (arguments.length === 1) {
      if (this.get('stream')) {
        return moment().subtract('days', 7);
      } else {
        return moment(this.get('startDateString') + ' ' + this.get('startTimeString'));
      }
    } else {
      value = moment(value);
      this.set('startDateString', value.format('M/D/YYYY'));
      this.set('startTimeString', value.format('h:mm A'));
      return value;
    }
  }.property('startDateString', 'startTimeString', 'stream').cacheable(),

  rawEnd: function(key, value) {
    if (arguments.length === 1) {
      if (this.get('stream')) {
        return moment().add('days', 1);
      } else {
        return moment(this.get('endDateString') + ' ' + this.get('endTimeString'));
      }
    } else {
      value = moment(value);
      this.set('endDateString', value.format('M/D/YYYY'));
      this.set('endTimeString', value.format('h:mm A'));
      return value;
    }
  }.property('endDateString', 'endTimeString', 'stream').cacheable(),

  start: function() {
    return this._getAdjustedForMap('rawStart');
  }.property('rawStart', 'useLocalTime', 'timezoneDifference').cacheable(),

  end: function() {
    return this._getAdjustedForMap('rawEnd');
  }.property('rawEnd', 'useLocalTime', 'timezoneDifference').cacheable(),

  radius: function() {
    var center = this.get('center');
    var corner = this.get('northEast');
    if (!(center && corner)) return 0;

    var top = [corner[0], center[1]];
    var height = new Map.Line(center, top);

    return height.length() * Map.circleRadiusRatio;
  }.property('center', 'northEast').cacheable(),

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

  isValid: function() {
    return _.isEmpty(this.get('errors'));
  }.property('errors'),

  errors: function() {
    var errors = [];

    if (!this.get('stream')) {
      if (_.isEmpty(this.get('startDateString')) || _.isEmpty(this.get('startTimeString')))
        errors.push("Please select a start date.");
      if (_.isEmpty(this.get('endDateString')) || _.isEmpty(this.get('endTimeString')))
        errors.push("Please select an end date.");
      if (_.isEmpty(errors) && moment(this.get('end')).isBefore(moment(this.get('start'))))
        errors.push("Select a start date that comes before the end date.");
    }

    if (this.get('radius') > 75000)
      errors.push("Increase the map zoom in order to provide more relevant results.");

    return errors;
  }.property('start', 'end', 'radius', 'stream').cacheable(),

  _getAdjustedForMap: function(prop) {
    if (this.get('useLocalTime')) {
      return this.get(prop);
    } else {
      var adjustedTime = moment(this.get(prop));
      adjustedTime.add('hours', this.get('timezoneDifference'));
      return adjustedTime;
    }
  }
});

IWitness.criteria = IWitness.Criteria.create();
