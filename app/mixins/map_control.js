IWitness.MapControl = Ember.Mixin.create({
  initZoomSlider: function() {
    var self = this;
    this.sliderEl = this.$('.map-zoom-control .slider').slider({
      value: this.get("zoomLevel"),
      min: 1,
      max: 21,
      step: 1,
      slide: function(event, ui) {
        self.set("zoomLevel", ui.value);
      }
    });
  },

  zoom: function() {
    var level = this.get('zoomLevel');
    if (this.get('map')) this.get('map').setZoom(level);
    if (this.sliderEl) this.sliderEl.slider("value", level);
  }.observes("zoomLevel"),

  zoomClass: function(){
    return 'l_' + this.get('zoomLevel');
  }.property('zoomLevel'),

  zoomIn: function() {
    this.incrementProperty("zoomLevel");
  },

  zoomOut: function() {
    this.decrementProperty("zoomLevel");
  },

  refreshMap: function() {
    if (this.getPath('isCurrentView') && this.get('map')) {
      this.get('map').forceResize();
    }
  }.observes("isCurrentView")

});
