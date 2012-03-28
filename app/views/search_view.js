IWitness.SearchView = Ember.View.extend({
  templateName: 'search_template',
  isVisibleBinding: 'IWitness.currentViewController.showingSearchResults'
});
