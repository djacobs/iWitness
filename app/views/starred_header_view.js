IWitness.StarredHeaderView = Ember.View.extend({
  templateName: 'starred_header_template',
  switchToResults: function(){
    IWitness.currentViewController.set('currentView', 'search_results');
  }
});
