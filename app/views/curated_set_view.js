IWitness.curatedSetView = Ember.View.extend({
  templateName: 'curated_set_template',
  isVisibleBinding: 'IWitness.curatedResultsToggleController.showingCuratedResults'
});
