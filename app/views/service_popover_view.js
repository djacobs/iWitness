IWitness.ServicePopoverView = Ember.View.extend({
  templateName: 'service_popover_template',
  isVisibleBinding: 'parentView.showingPopover',

  didInsertElement: function() {
    var self = this;
    $(document).click(function(e) {
      var clicked = $(e.target);
      if (!clicked.closest('#results-top-bar .status, #services-menu').length) {
        self.hide();
      }
    });
  },

  hide: function() {
    this.setPath('isVisible', false);
  }
});
