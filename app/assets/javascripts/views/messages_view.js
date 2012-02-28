IWitness.MessagesView = Ember.View.extend({
  templateName:         'messages_template',
  modelBinding:         'IWitness.criteriaController.content',
  flickrStatusBinding:  'IWitness.searchController.flickrStatus',
  twitterStatusBinding: 'IWitness.searchController.twitterStatus',
});
