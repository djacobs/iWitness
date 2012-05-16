IWitness.SearchView = Ember.View.extend({
  templateName: 'search_template',
  isVisibleBinding: 'IWitness.currentViewController.showingSearchResults',
  showingFilters: false,

  didInsertElement: function() {
    var button = this.$("#back-to-top-button");
    button.hide();
    $(window).on("scroll.backToTop", this._backToTopButton(button));
  },

  showFilters: function() {
    this.set('showingFilters', true);
  },

  hideFilters: function() {
    this.set('showingFilters', false);
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
  }

});
