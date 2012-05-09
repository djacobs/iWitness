IWitness.ResultView = Ember.View.extend(IWitness.PostedDateTime, {
  templateName:      'result_template',
  typeBinding:       'model.resultType',
  classNames:        ['item-wrapper'],
  classNameBindings: ['isSelected:selected', 'type'],
  attributeBindings: ['data-posted-time'],
  isVisibleBinding:  "visibilityMonitor.isVisible",

  'data-posted-time': function(){
    return this.getPath('postedTime');
  }.property('postedTime'),

  // results are inserted with class hidden. unhide them immediately
  // unless we're currently paused. this is a work-around for lack of
  // one time class name calculation.
  didInsertElement: function(){
    var visibilityMonitor = IWitness.VisibilityMonitor.create({result: this.get("model")});
    this.set("visibilityMonitor", visibilityMonitor);
  },

  isSelected: function() {
    return this.get('model') === this.getPath('parentView.selectedResult');
  }.property('parentView.selectedResult'),

  click: function(e) {
    if (e.target.tagName.toLowerCase() == 'a') return;
    this.get('parentView').selectResult(this.get('model'));
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

  _ensureVisibilityWhenSelected: function() {
    if (this.get("isSelected")) {
      var position = this.$().get(0).getBoundingClientRect();
      if (position.top < 0 || (position.top + position.height) > window.innerHeight) {
        var resultTop = this.$().offset().top;
        $(document).scrollTop(resultTop - 200);
      }
    }
  }.observes('isSelected'),

  toggleEmbedForm: function(){
    if(!this.getPath('model.embedHtml')) {
      this.get('model').fetchEmbed();
    } else {
      this.$('.popover').fadeIn(200);
    }
  },

  toggleEmbed: function(){
    this.$('.popover').delay(200).fadeToggle(200);
  }.observes('model.embedHtml'),

  flaggedView: Ember.View.extend({
    classNames:        ['flag'],
    classNameBindings: ['flagged:active'],

    flagged: function() {
      return this.getPath('parentView.model.flagged');
    }.property('parentView.model.flagged'),

    click: function() {
      this.getPath('parentView.model').toggleProperty('flagged');
    }
  }),

  recenterOnResult: function(){
    var lat = this.getPath('model.lat');
    var lng = this.getPath('model.lng');
    IWitness.criteria.set("center", [lat, lng]);
  }
});

IWitness.StarredResultView = IWitness.ResultView.extend({
  isVisible: true
});
