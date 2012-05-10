IWitness.MapControl = Ember.Mixin.create({
  initZoomSlider: function() {
    var self = this;
    this.sliderEl = this.$('.map-zoom-control .slider-widget').slider({
      value: this.get("zoomLevel"),
      min: IWitness.config.minMapZoom,
      max: IWitness.config.maxMapZoom,
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
    if (this.get("zoomLevel") < IWitness.config.maxMapZoom) this.incrementProperty("zoomLevel");
  },

  zoomOut: function() {
    if (this.get("zoomLevel") > IWitness.config.minMapZoom) this.decrementProperty("zoomLevel");
  },

  refreshMap: function() {
    if (this.getPath('isCurrentView') && this.get('map')) {
      this.get('map').forceResize();
    }
  }.observes("isCurrentView")

});
