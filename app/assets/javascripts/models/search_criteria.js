IWitness.searchCriteria = Ember.Object.create({
  radius: 1,

  start: function() {
    return this.get('startDate') + ' ' + this.get('startTime');
  }.property('startDate', 'startTime'),

  end: function() {
    return this.get('endDate') + ' ' + this.get('endTime');
  }.property('endDate', 'endTime'),

  searchParams: function() {
    return this.getProperties('location', 'keyword', 'start', 'end');
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
      errors.push("Select a start date that comes before the end date")

    return errors;
  }.property('start', 'end').cacheable()
});
