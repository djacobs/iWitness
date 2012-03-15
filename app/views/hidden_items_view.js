IWitness.HiddenItemsView = Ember.View.extend({
  templateName:     'hidden_items_template',
  classNames:       ['alert', 'alert-info'],
  isVisibleBinding: 'IWitness.resultSetController.hasHiddenItems',
  countBinding:     'IWitness.resultSetController.hiddenItemsCount',

  click: function(){
    $(window).scrollTop(0);
  }
});
