IWitness.MessagesView = Ember.View.extend({
  templateName:         'messages_template',

  clearStarred: function(){
    IWitness.starredSetController.clear();
  },

  exportLink: Ember.View.extend({
    tagName:    'a',
    classNames: 'btn btn-info misplaced-message-button-hack',
    attributeBindings: 'href',

    href: function() {
      var results = IWitness.starredSetController.map(function(result, idx){
        return (idx+1) + '. ' + result.get("permalinkUrl") + '%0D' + result.get("contentText");
      });
      results = results.join("%0D%0D");
      return "mailto:yourfriend@example.com?subject=iWitness Starred Results&body="+results;
    }.property('IWitness.starredSetController.content.length'),

    click: function() {
      var exportSize = IWitness.starredSetController.getPath('content.length');
      Analytics.track('starred results', 'exported', 'size of export', exportSize);
    }
  })
});
