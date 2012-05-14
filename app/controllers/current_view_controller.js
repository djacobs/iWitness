IWitness.currentViewController = Ember.Object.create({
  currentView: 'search_results',
  showWelcome: false,

  showingSearchResults: function(){
    return this.get('currentView') === 'search_results';
  }.property('currentView'),

  showingStarredResults: function(){
    return this.get('currentView') === 'starred_results';
  }.property('currentView'),

  showingWelcomeOverlay: function() {
    return this.get("showWelcome");
  }.property('showWelcome')
});
