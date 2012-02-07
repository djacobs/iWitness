IWitness.CriteriaView = Ember.View.extend({
  templateName: 'criteria_template',
  location: '39.76395,-86.1656,1km',
  start_date: '2/4/12',
  start_time: '5:30 PM',
  end_date: '2/4/12',
  end_time: '10:00 PM',
  keyword: 'test',

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
