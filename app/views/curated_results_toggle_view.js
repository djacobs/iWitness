IWitness.CuratedResultsToggleView = Ember.View.extend({
  templateName: 'curated_results_toggle_template',
  classNames: ['btn-group'],
  attributeBindings: ['data-toggle'],
  'data-toggle': 'buttons-radio',

  curated: function(e) {
    IWitness.curatedResultsToggleController.set('currentView', 'curated_results');
  },

  searchResults: function(e) {
    IWitness.curatedResultsToggleController.set('currentView', 'search_results');
  },
});
