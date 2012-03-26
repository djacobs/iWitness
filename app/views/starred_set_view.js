IWitness.StarredSetView = Ember.View.extend({
  templateName: 'starred_set_template',
  isVisibleBinding: 'IWitness.currentViewController.showingStarredResults'
});
