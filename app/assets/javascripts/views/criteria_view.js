IWitness.CriteriaView = Ember.View.extend({
  templateName: 'criteria_template',
  radius: 1,

  search: function(e) {
    var center = this.map.getCenter();
    IWitness.searchCriteria.set('location',
      center.lat() + "," + center.lng() + "," + this.get('radius') + "km");
    IWitness.searchCriteria.set('searchSubmitted', true);
    if (! IWitness.searchCriteria.get('isValid')) return;
    IWitness.ResultsetController.search();
  },

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
