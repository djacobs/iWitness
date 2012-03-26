IWitness.ResultView = Ember.View.extend({
  templateName:      'result_template',
  typeBinding:       'model.resultType',
  classNames:        ['hidden', 'item'],
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

  postedDate: function() {
    var m = this.getPath('model.postedMoment');
    if (IWitness.criteria.get('useLocalTime')) {
      return m.format('MM/DD/YY');
    } else {
      var offset = IWitness.criteria.get('mapTimezoneOffset');
      return m.formatWithTimezoneOffset(offset, 'MM/DD/YY');
    }
  }.property('model.postedMoment', 'IWitness.criteria.useLocalTime'),

  postedTime: function() {
    var m = this.getPath('model.postedMoment');
    if (IWitness.criteria.get('useLocalTime')) {
      return m.format('h:mm a');
    } else {
      var offset = IWitness.criteria.get('mapTimezoneOffset');
      return m.formatWithTimezoneOffset(offset, 'h:mm a');
    }
  }.property('model.postedMoment', 'IWitness.criteria.useLocalTime'),

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
      this.$('.embed').slideToggle();
    }
  },

  toggleEmbed: function(){
    this.$('.embed').delay(200).slideToggle();
  }.observes('model.embedHtml')


});
