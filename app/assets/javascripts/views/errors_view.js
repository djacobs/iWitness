IWitness.ErrorsView = Ember.View.extend({
  templateName: 'errors_template',
  contentBinding: 'IWitness.searchController',

  hideErrors: function() {
    return this.getPath('content.isValid') || !this.getPath('content.searchSubmitted');
  }.property('content.isValid', 'content.searchSubmitted')
});
