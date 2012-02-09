IWitness.SearchCriteriaView = Ember.View.extend({
  templateName: 'search_criteria_template',
  modelBinding: 'IWitness.searchController.content',
  radius: 1,

  search: function(e) {
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

    google.maps.event.addListener(this.map, 'zoom_changed', this.mapUpdate.bind(this));
    google.maps.event.addListener(this.map, 'dragend', this.mapUpdate.bind(this));
    this.mapUpdate();
  },

  mapUpdate: function() {
    var center = this.map.getCenter();
    this.setPath('model.lat', center.lat());
    this.setPath('model.lng', center.lng());
  }
});
