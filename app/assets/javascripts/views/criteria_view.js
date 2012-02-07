IWitness.CriteriaView = Ember.View.extend({
  templateName: 'criteria_template',
  location: '39.76395,-86.1656,1km',
  start_date: '2/5/12',
  start_time: '6:00 PM',
  end_date: '2/5/12',
  end_time: '9:30 PM',
  keyword: '*',

  search: function(e) {
    var params = this.getProperties('location', 'keyword', 'start', 'end');
    var search = new TwitterSearch(params);

    IWitness.ResultsetController.set('content', []);
    search.bind('data', function(results){
      IWitness.ResultsetController.pushObjects(results);
    });
    search.perform();
  },

  start: function() {
    return this.get('start_date') + ' ' + this.get('start_time');
  }.property('start_date', 'start_time'),

  end: function() {
    return this.get('end_date') + ' ' + this.get('end_time');
  }.property('end_date', 'end_time'),

  didInsertElement: function() {
    this.$('.date').datepicker();
    this.$('.time').timePicker({show24Hours: false});
  }
});
