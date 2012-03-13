IWitness.curatedResultsToggleController = Ember.Object.create({
  currentView: 'search_results',

  showingSearchResults: function(){
    return this.get('currentView') === 'search_results';
  }.property('currentView'),

  showingCuratedResults: function(){
    return this.get('currentView') === 'curated_results';
  }.property('currentView')

});
