IWitness.ResultView = Ember.View.extend({
  templateName:      'result_template',
  tagName:           'tr',
  typeBinding:       'model.resultType',
  classNameBindings: ['isSelected:selected', 'type'],

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

  curatedIcon: Ember.View.extend({
    tagName: 'i',

    didInsertElement: function(){
      var isCurated = IWitness.curatedResults.contains( this.getPath('parentView.model.resultId') );
      this._toggleIcon(isCurated);
    },

    click: function(e) {
      e.stopPropagation();
      var model = this.getPath('parentView.model');
      var isCurrentlyCurated = IWitness.curatedResults.contains( model.get('resultId') );
      var newToggleState = !isCurrentlyCurated;

      if(isCurrentlyCurated) {
        IWitness.curatedResults.removeResult( model );
      } else {
        IWitness.curatedResults.addResult( model );
      }
      this._toggleIcon(newToggleState);
    },

    _toggleIcon: function(isCurated){
      this.$().toggleClass('icon-star', isCurated).toggleClass('icon-star-empty', !isCurated);
    }
  })
});
