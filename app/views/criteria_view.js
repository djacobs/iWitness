IWitness.CriteriaView = Ember.View.extend({
  templateName: 'criteria_template',
  modelBinding: 'IWitness.criteriaController.content',
  radius: 1,

  streamingClass: function() {
    return this.getPath('model.stream') ? 'streaming' : ''
  }.property('model.stream'),

  streamSelector: Ember.View.extend({
    classNameBindings: ['streaming'],
    modelBinding: 'IWitness.criteriaController.content',

    streaming: function() {
      return this.getPath("model.stream");
    }.property('model.stream'),

    click: function() {
      this.get("model").toggleProperty("stream");
    }
  }),

  timezoneSelector: Ember.View.extend({
    classNames:   ["timezone-element"],
    modelBinding: 'IWitness.criteriaController.content',

    timezoneToggleClass: function() {
      if (this.getPath('model.useLocalTime')) {
        return 'handle local';
      } else {
        return 'handle map';
      }
    }.property('model.useLocalTime'),

    click: function(e) {
      IWitness.criteriaController.useLocalTime("toggle");
    },

    chooseLocalTime: function(e) {
      IWitness.criteriaController.useLocalTime(true);
      return false;
    },

    chooseMapTime: function(e) {
      IWitness.criteriaController.useLocalTime(false);
      return false;
    }

  }),

  showWelcome: function() {
    $('#welcome-overlay-cover').show();
  }
});
