IWitness.KeywordFilterView = Ember.View.extend({
  templateName: 'keyword_filter_template',
  criteriaBinding: 'IWitness.criteriaController.content',

  change: function(e) {
    IWitness.criteriaController.initiateSearch();
  }
});
