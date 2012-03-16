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

  exportLink: Ember.View.extend({
    tagName:    'a',
    classNames: 'btn btn-info misplaced-message-button-hack',
    attributeBindings: 'href',

    href: function() {
      var results = IWitness.curatedSetController.map(function(result, idx){
        return (idx+1) + '. ' + result.get("permalinkUrl") + '%0D' + result.get("contentText");
      });
      results = results.join("%0D%0D");
      return "mailto:yourfriend@example.com?subject=iWitness Curated Results&body="+results;
    }.property('IWitness.curatedSetController.content.length'),

    click: function() {
      var exportSize = IWitness.curatedSetController.getPath('content.length');
      Analytics.track('starred results', 'exported', 'size of export', exportSize);
    }
  })
});
