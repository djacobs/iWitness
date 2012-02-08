IWitness.searchCriteria = Ember.Object.create({
  start: function() {
    return this.get('start_date') + ' ' + this.get('start_time');
  }.property('start_date', 'start_time'),

  end: function() {
    return this.get('end_date') + ' ' + this.get('end_time');
  }.property('end_date', 'end_time'),

  searchParams: function() {
    return this.getProperties('location', 'keyword', 'start', 'end');
  },

  isValid: function() {
    _.isEmpty(this.get('errors'));
  },

  errors: function() {
    var errors = [];

    if (_.isEmpty(this.get('start_date')) || _.isEmpty(this.get('start_time')))
      errors.push("Please select a start date.");
    if (_.isEmpty(this.get('end_date')) || _.isEmpty(this.get('end_time')))
      errors.push("Please select an end date.");
    if (_.isEmpty(errors) && moment(this.get('end')).isBefore(moment(this.get('start'))))
      errors.push("Select a start date that comes before the end date")

    return errors;
  }.property('start_date', 'end_date', 'start_time', 'end_time')
});
