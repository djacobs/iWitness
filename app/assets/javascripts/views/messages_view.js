IWitness.MessagesView = Ember.View.extend({
  templateName:         'messages_template',
  modelBinding:         'IWitness.searchController.content',
  showErrorsBinding:    'IWitness.searchController.searchAttempted',
  flickrStatusBinding:  'IWitness.searchController.flickrStatus',
  twitterStatusBinding: 'IWitness.searchController.twitterStatus',
});
