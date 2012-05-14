IWitness.KeywordFilterView = Ember.View.extend({
  templateName: 'keyword_filter_template',
  criteriaBinding: 'IWitness.criteriaController.content',

  focusIn: function(e) {
    this.$('input').attr('placeholder', '');
  },

  focusOut: function(e) {
    this.$('input').attr('placeholder', 'Enter keyword');
  }
});
