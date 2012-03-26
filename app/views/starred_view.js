IWitness.StarredView = Ember.View.extend({
  templateName: 'starred_template',
  isVisibleBinding: 'IWitness.currentViewController.showingStarredResults'
});
