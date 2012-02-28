IWitness.MessagesView = Ember.View.extend({
  templateName:         'messages_template',
  modelBinding:         'IWitness.criteriaController.content',
  showErrorsBinding:    'IWitness.searchController.searchAttempted',
  flickrStatusBinding:  'IWitness.searchController.flickrStatus',
  twitterStatusBinding: 'IWitness.searchController.twitterStatus',
});
