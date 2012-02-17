IWitness.MessagesView = Ember.View.extend({
  templateName:      'messages_template',
  modelBinding:      'IWitness.searchController.content',
  showErrorsBinding: 'IWitness.searchController.searchAttempted',

  flickrStatus: function(){
    return this.statusForService('flickr');
  }.property('IWitness.searchController.activeSearches.length', 'IWitness.resultSetController.servicesWithResults.length'),

  twitterStatus: function(){
    return this.statusForService('twitter');
  }.property('IWitness.searchController.activeSearches.length', 'IWitness.resultSetController.servicesWithResults.length'),

  statusForService: function(type) {
    if (IWitness.searchController.isSearchingService(type)) {
      return 'searching';
    } else if (IWitness.resultSetController.hasResultsFor(type)) {
      return 'completed';
    } else {
      return 'no results';
    }
  }
});
