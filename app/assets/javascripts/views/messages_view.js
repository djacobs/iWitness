IWitness.MessagesView = Ember.View.extend({
  templateName:         'messages_template',
  modelBinding:         'IWitness.criteriaController.content',

  translateStatus: function(service){
    var status = IWitness.searchController.getPath('monitors.'+service+'.status')
    if (status == 'pending') return 'searching';
    else return status;
  },

  flickrStatus: function(){
    return this.translateStatus('flickr');
  }.property('IWitness.searchController.monitors.flickr.status'),

  twitterStatus: function(){
    return this.translateStatus('twitter');
  }.property('IWitness.searchController.monitors.twitter.status')
});
