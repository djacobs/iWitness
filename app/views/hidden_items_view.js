IWitness.HiddenItemsView = Ember.View.extend({
  templateName:     'hidden_items_template',
  classNames:       ['alert', 'alert-info'],
  isVisibleBinding: 'IWitness.hiddenItemsController.hasHiddenItems',
  countBinding:     'IWitness.hiddenItemsController.hiddenItemsCount',

  click: function(){
    $(window).scrollTop(0);
  }
});
