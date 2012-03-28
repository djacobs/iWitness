IWitness.MessagesView = Ember.View.extend({
  templateName:         'messages_template',

  clearStarred: function(){
    IWitness.starredSetController.clear();
  }
});
