IWitness.MessagesView = Ember.View.extend({
  templateName:         'messages_template',
  modelBinding:         'IWitness.criteriaController.content',
  flickrStatusBinding:  'IWitness.searchController.monitors.flickr.status',
  twitterStatusBinding: 'IWitness.searchController.monitors.twitter.status'
});
