IWitness.CriteriaView = Ember.View.extend({
  templateName: 'criteria_template',
  start_date: '2/5/12',
  start_time: '6:00 PM',
  end_date: '2/5/12',
  end_time: '6:30 PM',
  radius: 1,
  keyword: 'pats',

  search: function(e) {
    var center = this.map.getCenter();
    this.set('location', center.lat() + "," + center.lng() + "," + this.get('radius') + "km");

    var params = this.getProperties('location', 'keyword', 'start', 'end');
    IWitness.ResultsetController.search(params);
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

    this.map = new google.maps.Map(document.getElementById("map"), {
      center:    new google.maps.LatLng(39.76395,-86.1656),
      zoom:      13,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
  }
});
