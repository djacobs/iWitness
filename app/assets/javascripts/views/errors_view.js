IWitness.ErrorsView = Ember.View.extend({
  templateName: 'errors_template',

  hideErrors: function() {
    console.log('laksj');
    return this.model.get('isValid') || !this.model.get('searchSubmitted');
  }.property('model.isValid', 'model.searchSubmitted')
});
