IWitness.currentViewController = Ember.Object.create({
  currentView: 'search_results',

  showingSearchResults: function(){
    return this.get('currentView') === 'search_results';
  }.property('currentView'),

  showingStarredResults: function(){
    return this.get('currentView') === 'starred_results';
  }.property('currentView')

});
