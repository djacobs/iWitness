IWitness.ResultView = Ember.View.extend(IWitness.PostedDateTime, {
  templateName:      'result_template',
  typeBinding:       'model.resultType',
  classNames:        ['hidden', 'item-wrapper'],
  classNameBindings: ['isSelected:selected', 'type'],
  attributeBindings: ['data-posted-time'],

  'data-posted-time': function(){
    return this.getPath('postedTime');
  }.property('postedTime'),

  // results are inserted with class hidden. unhide them immediately
  // unless we're currently paused. this is a work-around for lack of
  // one time class name calculation.
  didInsertElement: function(){
    if(!IWitness.hiddenItemsController.get('paused')){
      this.$().removeClass('hidden');
    }
  },

  isSelected: function() {
    return this.get('model') == IWitness.resultSetController.get('selectedResult');
  }.property('IWitness.resultSetController.selectedResult'),

  click: function(e) {
    if (e.target.tagName.toLowerCase() == 'a') return;
    IWitness.resultSetController.set('selectedResult', this.get('model'));
  },

  toggleCuration: function() {
    IWitness.starredSetController.toggleCuration(this.get('model'));
    return false;
  },

  starButtonClass: function() {
    var model = this.get('model');

    if (IWitness.starredSetController.isStarred(model)) {
      return 'icon-star';
    } else {
      return 'icon-star-empty';
    }
  }.property('IWitness.starredSetController.@each'),

  toggleEmbedForm: function(){
    if(!this.getPath('model.embedHtml')) {
      this.get('model').fetchEmbed();
    } else {
      this.$('.popover').fadeIn(200);
    }
  },

  toggleEmbed: function(){
    this.$('.popover').delay(200).fadeToggle(200);
  }.observes('model.embedHtml')

});
