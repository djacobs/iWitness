IWitness.MessagesView = Ember.View.extend({
  templateName:         'messages_template',

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
