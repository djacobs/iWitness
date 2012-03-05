IWitness.MessagesView = Ember.View.extend({
  templateName:         'javascripts/messages_template',
  modelBinding:         'IWitness.criteriaController.content',

  translateStatus: function(service){
    var status = IWitness.searchController.getPath('monitors.'+service+'.status')
    if (status == 'pending'){
      return this.getPath('model.isValid') ? 'searching' : 'no results';
    } else {
      return status;
    }
  },

  flickrStatus: function(){
    return this.translateStatus('flickr');
  }.property('IWitness.searchController.monitors.flickr.status', 'model.isValid'),

  twitterStatus: function(){
    return this.translateStatus('twitter');
  }.property('IWitness.searchController.monitors.twitter.status', 'model.isValid')
});
