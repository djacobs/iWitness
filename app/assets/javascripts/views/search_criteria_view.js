IWitness.SearchCriteriaView = Ember.View.extend({
  templateName: 'search_criteria_template',
  modelBinding: 'IWitness.searchController.content',
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
    modelBinding: 'IWitness.searchController.content',

    change: function() {
      this.setPath('model.stream', this.$().is(':checked'));
    }
  }),

  keywordField: Ember.TextField.extend({
    change: function(e) {
      this._super();
      IWitness.searchController.oldSearch();
    }
  }),

  dateField: Ember.TextField.extend({
    disabledBinding: 'model.stream',
    modelBinding: 'IWitness.searchController.content',

    change: function(e) {
      this._super();
      IWitness.searchController.oldSearch();
    }
  }),

  timezoneSelector: Ember.View.extend({
    attributeBindings: ['type', 'checked', 'disabled'],
    tagName:           'input',
    type:              'radio',
    checkedBinding:    'isSelected',
    disabledBinding: 'model.stream',
    modelBinding:      'IWitness.searchController.content',

    isSelected: function() {
      return this.getPath('model.useTimezone') == this.get('timezone');
    }.property('timezone', 'model.useTimezone'),

    change: function() {
      this.setPath('model.useTimezone', this.get('timezone'));
    }
  })
});
