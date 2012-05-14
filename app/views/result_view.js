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
    IWitness.savedSetController.toggleCuration(this.get('model'));
    return false;
  },

  starButtonClass: function() {
    var model = this.get('model');

    if (IWitness.savedSetController.isSaved(model)) {
      return 'icon-heart';
    } else {
      return 'icon-heart-empty';
    }
  }.property('IWitness.savedSetController.@each'),

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
  },

  contentText: function() {
    var linkRegex = /(((http|https):\/\/)[\w-]+\.([\w-]+\.?)+|([\w-]+\.){2,}\w+)(:[0-9]+)?[\w#!:.?+=&%@!\-\/]*/g;
    var result = this.getPath("model.contentText");
    var match;
    var reCount = 0;
    var links = {};
    var placeholder;

    // links
    while (match = linkRegex.exec(result)) {
      reCount++;
      placeholder = "__iWitness_link_"+reCount+"__";
      links[placeholder] = match[0];
      result = result.replace(match[0], placeholder);
    }

    result = Handlebars.Utils.escapeExpression(result);

    _.each(_(links).keys(), function(key) {
      result = result.replace(key, '<a target="_blank" href="'+links[key]+'">'+links[key]+'</a>');
    });

    if (this.getPath("model.isTweet")) {
      // mentions
      result = result.replace(/(^|\W)@(\w+)/g, "$1<a href=\"http://twitter.com/$2\" target=\"_blank\">@$2</a>")

      // hash tags
      result = result.replace(/(^|\s)#(\w+)/g, "$1<a href=\"http://twitter.com/search?q=%23$2\" target=\"_blank\">#$2</a>");
    }

    return new Handlebars.SafeString(result);
  }.property("model.contentText")
});

IWitness.SavedResultView = IWitness.ResultView.extend({
  isVisible: true
});
