IWitness.SavedSetView = Ember.View.extend({
  templateName: 'saved_set_template',

  selectResult: function(result) {
    IWitness.savedSetController.set('selectedResult', result);
  },

  selectedResult: function() {
    return IWitness.savedSetController.get('selectedResult');
  }.property('IWitness.savedSetController.selectedResult')

});
