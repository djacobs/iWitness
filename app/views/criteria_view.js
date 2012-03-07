IWitness.CriteriaView = Ember.View.extend({
  templateName: 'criteria_template',
  modelBinding: 'IWitness.criteriaController.content',
  radius: 1,

  didInsertElement: function() {
    this.$('.date').datepicker();
    this.$('.time').timePicker({show24Hours: false});
  },

  streamSelector: Ember.View.extend({
    attributeBindings: ['type', 'checked'],
    tagName: 'input',
    type: 'checkbox',
    checkedBinding: 'model.stream',
    modelBinding: 'IWitness.criteriaController.content',

    change: function() {
      this.setPath('model.stream', this.$().is(':checked'));
      IWitness.criteriaController.initiateSearch();
    }
  }),

  keywordField: Ember.TextField.extend({
    change: function(e) {
      this._super();
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

  timezoneSelector: Ember.View.extend({
    attributeBindings: ['type', 'checked', 'disabled'],
    tagName:           'input',
    type:              'radio',
    checkedBinding:    'isSelected',
    disabledBinding: 'model.stream',
    modelBinding:      'IWitness.criteriaController.content',

    isSelected: function() {
      return this.getPath('model.useTimezone') == this.get('timezone');
    }.property('timezone', 'model.useTimezone'),

    change: function() {
      this.setPath('model.useTimezone', this.get('timezone'));
    }
  })
});
