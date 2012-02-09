IWitness.ErrorsView = Ember.View.extend({
  templateName: 'errors_template',
  modelBinding: 'IWitness.searchController.content',

  hideErrors: function() {
    return this.getPath('model.isValid') || !IWitness.searchController.get('searchSubmitted');
  }.property('model.isValid', 'IWitness.searchController.searchSubmitted')
});
