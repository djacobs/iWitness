IWitness.curatedSetView = Ember.View.extend({
  templateName: 'curated_set_template',

  isVisible: function() {
    return IWitness.curatedResultsToggleController.currentView == 'curated_results';
  }.property('IWitness.curatedResultsToggleController.currentView'),
});
