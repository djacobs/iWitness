IWitness.CriteriaView = Ember.View.extend({
  templateName: 'criteria_template',
  modelBinding: 'IWitness.criteriaController.content',
  streamingTimeBinding: 'IWitness.currentTime',
  radius: 1,

  streamSelector: Ember.View.extend({
    classNameBindings: ['streaming'],
    modelBinding: 'IWitness.criteriaController.content',

    streaming: function() {
      var isStreaming = this.getPath('model.stream');
      $('#date_and_time_selectors')[isStreaming ? 'addClass' : 'removeClass' ]('streaming');
      return isStreaming;
    }.property('model.stream'),

    click: function() {
      this.setPath('model.stream', !this.getPath('model.stream'));
      IWitness.criteriaController.initiateSearch();
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

  })
});
