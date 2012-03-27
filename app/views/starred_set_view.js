IWitness.StarredSetView = Ember.View.extend({
  templateName: 'starred_set_template',

  selectResult: function(result) {
    IWitness.starredSetController.set('selectedResult', result);
  },

  selectedResult: function() {
    return IWitness.starredSetController.get('selectedResult');
  }.property('IWitness.starredSetController.selectedResult')

});
