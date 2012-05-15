IWitness.SearchView = Ember.View.extend({
  templateName: 'search_template',
  isVisibleBinding: 'IWitness.currentViewController.showingSearchResults',

  didInsertElement: function() {
    var button = this.$("#back-to-top-button");
    button.hide();
    $(window).on("scroll.backToTop", this._backToTopButton(button));
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
