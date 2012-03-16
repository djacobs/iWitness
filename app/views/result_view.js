IWitness.ResultView = Ember.View.extend({
  templateName:      'result_template',
  tagName:           'tr',
  typeBinding:       'model.resultType',
  classNames:        ['hidden'],
  classNameBindings: ['isSelected:selected', 'type'],

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

  postedTime: function() {
    var m = this.getPath('model.postedMoment');
    if (IWitness.criteria.get('useTimezone') == 'mine') {
      return m.format('M/D h:mma');
    } else {
      var offset = IWitness.criteria.get('mapTimezoneOffset');
      return m.formatWithTimezoneOffset(offset, 'M/D h:mma');
    }
  }.property('model.postedMoment', 'IWitness.criteria.useTimezone'),

  click: function(e) {
    if (e.target.tagName.toLowerCase() == 'a') return;
    IWitness.resultSetController.set('selectedResult', this.get('model'));
  },

  toggleCuration: function() {
    IWitness.curatedSetController.toggleCuration(this.get('model'));
    return false;
  },

  curateButtonClass: function() {
    var model = this.get('model');

    if (IWitness.curatedSetController.isCurated(model)) {
      return 'icon-star';
    } else {
      return 'icon-star-empty';
    }
  }.property('IWitness.curatedSetController.@each'),

  toggleEmbedForm: function(){
    if(!this.getPath('model.embedHtml')) {
      this.get('model').fetchEmbed();
    } else {
      this.$('.embed').slideToggle();
    }
  },

  toggleEmbed: function(){
    this.$('.embed').delay(200).slideToggle();
  }.observes('model.embedHtml')


});
