IWitness.SearchView = Ember.View.extend({
  templateName: 'search_template',
  isVisibleBinding: 'IWitness.currentViewController.showingSearchResults',

  didInsertElement: function() {
    var self = this;
    var button = this.$("#back-to-top-button");
    button.hide();
    $(window).on("scroll.backToTop", this._backToTopButton(button));

    $(document).click(function(e) {
      var clicked = $(e.target);
      if (!clicked.closest('#show-filters-button').length &&
          !clicked.closest('#filter-popover .content').length) {
        self.hideFilters();
      }
    });
  },

  showFilters: function() {
    this.$("#filter-popover").show();
  },

  hideFilters: function() {
    this.$("#filter-popover").hide();
  },

  backToTop: function() {
    $(document).scrollTop(0);
  },

  _backToTopButton: function(button) {
    return _.debounce(function(e) {
      if ($(window).scrollTop() > 100) {
        button.show();
      } else {
        button.hide();
      }
    }, 100);
  },

  toggleServiceFilters: function() {
    this.$(".service_toggle_button").toggleClass('open');
    this.$("#available_services").toggle();
  }

});
