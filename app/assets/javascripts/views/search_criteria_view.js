IWitness.SearchCriteriaView = Ember.View.extend({
  templateName: 'search_criteria_template',
  modelBinding: 'IWitness.searchController.content',
  radius: 1,

  buttonText: function() {
    if (this.getPath('model.stream')) {
      return 'Begin Streaming';
    } else {
      return 'Search';
    }
  }.property('model.stream'),

  search: function(e) {
    IWitness.routes.visitSearch(this.get('model'));
  },

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

  dateField: Ember.TextField.extend({
    disabledBinding: 'model.stream',
    modelBinding: 'IWitness.searchController.content'
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
