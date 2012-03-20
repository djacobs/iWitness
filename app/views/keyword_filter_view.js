IWitness.KeywordFitlerView = Ember.TextField.extend({
  valueBinding: 'IWitness.criteriaController.content.keyword',

  change: function(e) {
    this._super();
    IWitness.criteriaController.initiateSearch();
  }
});
