IWitness.SearchCriteriaView = Ember.View.extend({
  templateName: 'search_criteria_template',
  modelBinding: 'IWitness.searchController.content',
  radius: 1,

  search: function(e) {
    IWitness.routes.visitSearch(this.get('model'));
  },

  didInsertElement: function() {
    this.$('.date').datepicker();
    this.$('.time').timePicker({show24Hours: false});
  },

  timezoneSelector: Ember.View.extend({
    attributeBindings: ['type', 'checked'],
    tagName:           'input',
    type:              'radio',
    checkedBinding:    'isSelected',
    modelBinding:      'IWitness.searchController.content',

    isSelected: function() {
      return this.getPath('model.useTimezone') == this.get('timezone');
    }.property('timezone', 'model.useTimezone'),

    change: function() {
      this.setPath('model.useTimezone', this.get('timezone'));
    }
  })
});
