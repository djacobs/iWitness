IWitness.ResultView = Ember.View.extend({
  templateName: 'result_template',
  tagName: 'tr',

  click: function(e) {
    if (e.target.tagName.toLowerCase() == 'a') return;
    IWitness.searchController.createMarkerForResult(this.get('model'));
  }
});
