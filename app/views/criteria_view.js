IWitness.CriteriaView = Ember.View.extend({
  templateName: 'criteria_template',
  modelBinding: 'IWitness.criteriaController.content',
  radius: 1,

  didInsertElement: function() {
    this.$('.date').datepicker();
    this.$('.time').timePicker({show24Hours: false});
  },

  streamSelector: Ember.View.extend({
    classNameBindings: ['streaming'],
    modelBinding: 'IWitness.criteriaController.content',

    streaming: function() {
      return this.getPath('model.stream');
    }.property('model.stream'),

    click: function() {
      this.setPath('model.stream', !this.getPath('model.stream'));
      IWitness.criteriaController.initiateSearch();
    }
  }),

  dateField: Ember.TextField.extend({
    disabledBinding: 'model.stream',
    modelBinding: 'IWitness.criteriaController.content',

    change: function(e) {
      this._super();
      IWitness.criteriaController.initiateSearch();
    }
  }),

  dateTimeSelector: Ember.View.extend({
    templateName: "date_time_selector_template",
    modelBinding: "IWitness.criteriaController.content",

    moment: function() {
      return this.get("model").get(this.get("whichDate"));
    }.property("model.start", "model.end", "whichDate"),

    day: function(){
      return this.get("moment").date();
    }.property("moment"),

    month: function(){
      return this.get("moment").format("MMM");
    }.property("moment"),

    year: function(){
      return this.get("moment").year();
    }.property("moment"),

    hours: function(){
      var hours = this.get("moment").hours();
      return (hours + 13) % 12;
    }.property("moment"),

    minutes: function(){
      return this.get("moment").minutes();
    }.property("moment"),

    period: function(){
      if (this.get("moment").hours() < 11)
        return "AM";
      else
        return "PM";
    }.property("moment"),
  }),

  timezoneSelector: Ember.View.extend({
    modelBinding:      'IWitness.criteriaController.content',

    timezoneToggleClass: function() {
      if (this.getPath('model.useLocalTime')) {
        return 'handle local';
      } else {
        return 'handle map';
      }
    }.property('model.useLocalTime'),

    click: function(e) {
      this.get('model').toggleProperty('useLocalTime');
    },

    chooseLocalTime: function(e) {
      this.setPath('model.useLocalTime', true);
      return false;
    },

    chooseMapTime: function(e) {
      this.setPath('model.useLocalTime', false);
      return false;
    }
  }),

  startDay: function(){

  }.property("model.start"),

});
