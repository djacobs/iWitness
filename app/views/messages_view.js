IWitness.MessagesView = Ember.View.extend({
  templateName:         'messages_template',
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
  }.property('IWitness.searchController.monitors.twitter.status', 'model.isValid'),

  clearCurated: function(){
    IWitness.curatedSetController.clear();
  },

  exportLink: function(){
    var results = IWitness.curatedSetController.map(function(result, idx){
      return (idx+1) + '. ' + result.get("permalinkUrl") + '%0D' + result.get("contentText");
    });
    results = results.join("%0D%0D");
    return "mailto:yourfriend@example.com?subject=iWitness Curated Results&body="+results;
  }.property('IWitness.curatedSetController.content')
});
