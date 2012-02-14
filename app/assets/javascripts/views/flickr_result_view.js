IWitness.FlickrResultView = Ember.View.extend({
  templateName: 'flickr_result_template',
  tagName: 'tr',
  classNameBindings: 'isSelected:selected',

  isSelected: function() {
    return this.get('model') == IWitness.resultSetController.get('selectedResult');
  }.property('IWitness.resultSetController.selectedResult'),

  click: function(e) {
    if (e.target.tagName.toLowerCase() == 'a') return;
    IWitness.resultSetController.set('selectedResult', this.get('model'));
  }
});
