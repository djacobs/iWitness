IWitness.SearchCriteriaView = Ember.View.extend({
  templateName: 'search_criteria_template',
  modelBinding: 'IWitness.searchController.content',
  radius: 1,

  search: function(e) {
    SC.routes.set('location', {
      route: '/search',
      startDate: this.getPath('model.startDate'),
      startTime: this.getPath('model.startTime'),
      endDate: this.getPath('model.endDate'),
      endTime: this.getPath('model.endTime'),
      keyword: this.getPath('model.keyword'),
      center: this.getPath('model.center'),
      northEast: this.getPath('model.northEast'),
      southWest: this.getPath('model.southWest'),
      radius: this.getPath('model.radius')
    });
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
