IWitness.searchCriteria = Ember.Object.create({
  flickrKey: 'd8e03d0c91caffad9c85eccb1a54dc18',

  timezoneOffset: function() {
    return parseInt(moment().format('ZZZ'), 10) / 100;
  }.property().cacheable(),

  mapTimezoneOffset: function() {
    if (!this.get('center')) return;
    return IWitness.spaceAndTime.utcOffset(this.get('center')) / 3600;
  }.property('center', 'IWitness.spaceAndTime.isLoaded').cacheable(),

  start: function() {
    return this.get('startDate') + ' ' + this.get('startTime');
  }.property('startDate', 'startTime'),

  end: function() {
    return this.get('endDate') + ' ' + this.get('endTime');
  }.property('endDate', 'endTime'),

  radius: function() {
    var center = this.get('center');
    var corner = this.get('northEast');
    if (!(center && corner)) return 0;

    var radius = new Map.Line(center, corner);
    return Math.ceil(radius.length() / 1000);
  }.property('center', 'northEast').cacheable(),

  searchParams: function() {
    return this.getProperties('mapTimezoneOffset',
                              'flickrKey',
                              'center',
                              'radius',
                              'keyword',
                              'start',
                              'end',
                              'northEast',
                              'southWest');
  },

  isValid: function() {
    return _.isEmpty(this.get('errors'));
  }.property('errors'),

  errors: function() {
    var errors = [];

    if (_.isEmpty(this.get('startDate')) || _.isEmpty(this.get('startTime')))
      errors.push("Please select a start date.");
    if (_.isEmpty(this.get('endDate')) || _.isEmpty(this.get('endTime')))
      errors.push("Please select an end date.");
    if (_.isEmpty(errors) && moment(this.get('end')).isBefore(moment(this.get('start'))))
      errors.push("Select a start date that comes before the end date.");
    if (this.get('radius') > 75)
      errors.push("Increase the map zoom in order to provide more relevant results.");

    return errors;
  }.property('start', 'end', 'radius').cacheable()
});
