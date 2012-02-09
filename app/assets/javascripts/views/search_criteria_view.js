IWitness.SearchCriteriaView = Ember.View.extend({
  templateName: 'search_criteria_template',
  modelBinding: 'IWitness.searchController.content',
  radius: 1,

  search: function(e) {
    var center = this.map.getCenter();
    this.setPath('model.location', center.lat() + "," + center.lng() + "," + this.getPath('model.radius') + "km");

    IWitness.searchController.search();
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
